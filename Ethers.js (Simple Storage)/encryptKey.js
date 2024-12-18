const fs = require("fs");
const ethers = require("ethers");

require("dotenv").config();

// Delete the PRIVATE_KEY and PRIVATE_KEY_PASSWORD from the .env file after running this once
async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const encryptedJsonKey = await wallet.encrypt(process.env.PRIVATE_KEY_PASSWORD);

    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });