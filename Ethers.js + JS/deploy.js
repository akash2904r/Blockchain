const fs = require("fs");
const ethers = require("ethers");

async function main() {
    // http://127.0.0.1:7545  => Ganache RPC URL
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    const wallet = new ethers.Wallet(
        "04d23a3f9cfaec2a7748dcca5a5df6e7e9143f6747c96d231279d925a0b7eeda",
        provider
    );

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...")
    // Returns a contract object
    const contract = await contractFactory.deploy();
    console.log(contract)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    });