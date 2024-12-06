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