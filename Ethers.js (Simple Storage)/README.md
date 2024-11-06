# Ethers Simple Storage

In this particular directory `i.e., Ethers.js (Simple Storage)`, we can understand how to use the ethers.js package inorder to deploy and interact with a smart contract.

# Getting Started

## Setup

Clone the repository

```bash
git clone https://github.com/akash2904r/Blockchain
```

Then cd into the this particular directory

```bash
cd Blockchain/Ethers.js\ \(Simple\ Storage\)/
```

Install all the dependencies

```bash
npm install
```

## Details 

The following code is used inorder to create a provider and an wallet 

```javascript
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
```

The following code is used for deploying the contract

```javascript
const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
const contract = await contractFactory.deploy();
```

Whenever we `wait` for a block confirmation, the returned value would be the transaction receipt. In case, if we don't `wait` for the block confirmation, the returned value would be the transaction response.

```javascript
const transactionReceipt = await contract.deploymentTransaction().wait(1);
```

The following code is used for signing and sending an transaction

```javascript
const sentTxResponse = await wallet.sendTransaction(tx);
await sentTxResponse.wait(1);
```

## Usage

Command for compiling the smart contract inorder to get the abi and bin files

```bash
solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol
```

Run the application

```bash
node deploy.js
```

## Security

We can use and .env file as shown in the repo inorder for securing sensitive data such as private key, rpc urls etc. 

```bash
npm install dotenv
```

After installing the dotenv package, create a .env file in the same directory where the package.json is present and add all the sensitive data into it.

If you find this method to be not more secure then you can directly input the environment variables in the terminal while running the application itself

```bash
[~/Ethers (Simple Storage)] $ RPC_URL=<RPC_URL> PRIVATE_KEY=<PRIVATE_KEY> node deploy.js
```

Or else, you can use a password to encrypt your `private key` by running the following code once. Later delete the `private key` and `private key password` from the .env file

```javascript
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const encryptedJsonKey = await wallet.encrypt(process.env.PRIVATE_KEY_PASSWORD);

fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
```

After encrypting the `private key` make sure to store it in another file inorder for the future use

Now, read this encrypted key from the file and create a wallet using the following method

```javascript
const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
let wallet = new ethers.Wallet.fromEncryptedJson(encryptedJson, process.env.PRIVATE_KEY_PASSWORD);
wallet = await wallet.connect(provider);
```

Finally, you can input the password while you are running the application for a much better security

```bash
[~/Ethers (Simple Storage)] $ PRIVATE_KEY_PASSWORD=<PRIVATE_KEY_PASSWORD> node deploy.js
```

---

<span style="font-size:32px;">**Thank you !**</span>

Make sure to leave a star ⭐