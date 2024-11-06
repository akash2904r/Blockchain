const { ethers } = require("hardhat");

async function main() {
    // Hardhat is smart enough to know about the contract with just it's name, if compiled
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.waitForDeployment();
    console.log(`Deployed contract to: ${simpleStorage.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });