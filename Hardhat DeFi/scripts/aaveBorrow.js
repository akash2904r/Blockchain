const { getNamedAccounts } = require("hardhat");
const { getWeth, AMOUNT } = require("./getWeth");

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    // Pool Provider Address: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e
    const pool = await getPool(deployer);
    console.log(`Pool Address: ${pool.address}`);

    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    // Approve the token inorder to deposit it in the aave protocol
    await approveERC20(wethTokenAddress, pool.address, AMOUNT, deployer);
    console.log("Depositing WETH...");
    await pool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
    console.log("Deposited!");

    // Account User Data
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(pool, deployer);
    // Current price of 1 DAI token in terms of ETH
    const daiPrice = await getDaiPrice();
    /**
     * availableBorrowsETH -> The amount of ETH you are allowed to borrow based on your collateral
     * 0.95 -> A buffer/safety margin of 95%, meaning you are only using 95% of the available borrowing limit
     * This is a risk management strategy to avoid liquidation
     * daiPrice -> The price of 1 DAI in ETH
     */
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());
    console.log(`You can borrow ${amountDaiToBorrow} DAI`);
    const amountDaiToBorrowWei = ethers.utils.parseUnits(amountDaiToBorrow.toString(), "ether");

    // Borrowing DAI token
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    await borrowDai(daiTokenAddress, pool, amountDaiToBorrowWei, deployer);
    await getBorrowUserData(pool, deployer);
}

async function borrowDai(
    daiAddress, pool, amountDaiToBorrowWei, account
) {
    const borrowTx = await pool.borrow(daiAddress, amountDaiToBorrowWei, 1, 0, account);
    await borrowTx.wait(1);
    console.log(`You borrowed!`);
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt("AggregatorV3Interface", "0x773616E4d11A78F511299002da57A0a94577F1f4");
    const price = (await daiEthPriceFeed.latestRoundData())[1];
    console.log(`The DAI/ETH price is ${price.toString()}`);
    return price;
}

async function getBorrowUserData(pool, account) {
    const { totalCollateralBase, totalDebtBase, availableBorrowsBase } = await pool.getUserAccountData(account);
    // ETH / USD : 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
    const ethUsdPriceFeed = await ethers.getContractAt("AggregatorV3Interface", "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");
    const ethUsdValue = (await ethUsdPriceFeed.latestRoundData())[1];
    const availableBorrowsETH = (availableBorrowsBase / ethUsdValue) * 1e18;
    const totalDebtETH = (totalDebtBase / ethUsdValue) * 1e18;
    const totalCollateralETH = (totalCollateralBase / ethUsdValue) * 1e18;
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return { availableBorrowsETH, totalDebtETH };
}

async function getPool(account) {
    const poolAddressesProvider = await ethers.getContractAt("IPoolAddressesProvider", "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e", account);
    const poolAddress = await poolAddressesProvider.getPool();
    const pool = await ethers.getContractAt("IPool", poolAddress, account);
    return pool;
}

async function approveERC20(erc20Address, spenderAddress, amount, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account);
    const tx = await erc20Token.approve(spenderAddress, amount);
    await tx.wait(1);
    console.log("Approved!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })