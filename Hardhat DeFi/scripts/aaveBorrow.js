const { getNamedAccounts } = require("hardhat");
const { getWeth } = require("./getWeth");

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    // Pool Provider Address: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e
    const pool = await getPool(deployer);
    console.log(`Pool Address: ${pool.address}`)
}

async function getPool(account) {
    const poolAddressesProvider = await ethers.getContractAt("IPoolAddressesProvider", "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e", account);
    const poolAddress = await poolAddressesProvider.getPool();
    const pool = await ethers.getContractAt("IPool", poolAddress, account);
    return pool;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })