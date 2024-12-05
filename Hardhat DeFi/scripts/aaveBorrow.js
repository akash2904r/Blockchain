const { getNamedAccounts } = require("hardhat");
const { getWeth } = require("./getWeth");

async function main() {
    await getWeth();
}

async function getPool() {}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })