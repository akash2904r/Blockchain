const fs = require("fs");
const ethers = require("ethers");

async function main() {
    // http://127.0.0.1:7545  => Ganache RPC URL
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    const wallet = new ethers.Wallet(
        "8a325d054c0c4e3bb5185965c4b6e4ae4fb4c53267103ba19e90b030e701dd8c",
        provider
    );

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");

    // Returns a contract object
    const contract = await contractFactory.deploy();
    // We can override certain things using an override object
    // const contract = await contractFactory.deploy({ gasPrice: 100000000000 });
    
    // Returns the transaction receipt, only if we wait for a block confirmation
    const transactionReceipt = await contract.deploymentTransaction().wait(1);
    // Else returns the transaction response for something like this
    // const transactionReceipt = await contract.deploymentTransaction();
    

    // console.log("Deploying with transaction data !!!");

    // const nonce = await wallet.getNonce();
    // const tx = {
    //     nonce,
    //     gasPrice: 20000000000,
    //     gasLimit: 6721975,
    //     to: null,
    //     value: 0,
    //     data: `0x${binary}`,
    //     chainId: 1337
    // };

    // // Used to sign a transaction but not to send it
    // // const signedTxResponse = await wallet.signTransaction(tx);

    // // Used to sign and then send a transaction from one address to another
    // const sentTxResponse = await wallet.sendTransaction(tx);
    // await sentTxResponse.wait(1);
    // // Use something like this, for a single line
    // // const sentTxResponse = (await wallet.sendTransaction(tx)).wait(1)
    // console.log(sentTxResponse)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    });