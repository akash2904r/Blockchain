const { getNamedAccounts, ethers } = require("hardhat");

async function main () {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);

    console.log("Withdrawing from contract...");

    const txResponse = await fundMe.withdraw();
    await txResponse.wait(1);

    console.log("Withdrawal successfully !!!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })