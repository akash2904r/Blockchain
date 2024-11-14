import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connect");
const fundButton = document.getElementById("fund");
const balanceButton = document.getElementById("balance");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;

async function connect () {
    if (typeof window.ethereum !== undefined) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
        }
        document.getElementById("connectContainer").innerHTML = "<strong>Connected!</strong>";

        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
    } else {
        document.getElementById("connectContainer").innerHTML = "Please install metamask";
    }
}

async function getBalance () {
    if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);    
    }
}

async function fund () {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount} ETH...`);

    if (typeof window.ethereum !== undefined) {
        /** Requirements inorder to call fund method:
          *  Provider / Connection to the blockchain
          *  Signer / Wallet / Someone with some gas
          *  Contract we are interacting with: ABI & Address
          */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const txResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) });
            await listenForTransactionMine(txResponse, provider);
            console.log("Done!");
        } catch (error) {
            console.log(error);
        }

    }
}

function listenForTransactionMine (txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`);
    // Listen for the transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(`Completed with ${txReceipt.confirmations} confirmations`);
            resolve();
        });
    });
}