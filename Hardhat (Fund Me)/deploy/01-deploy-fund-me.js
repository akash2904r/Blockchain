const { network } = require("hardhat");

const { verify } = require("../utils/verify");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");

require("dotenv").config();

// const { getNamedAccounts, deployments } = hre
// hre => Hardhat Runtime Environment
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    // Comes from the hardhat.config.js file i.e., namedAccounts field
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;
    // The network that we are deploying our contract is an local network
    // Then we go ahead and deploy the mock contract
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args, // Constructor Arguments
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // If the network that we are deploying our contract isn't a local network
    // Then we go ahead and verify the contract on etherscan programmatically
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }
    log("----------------------------------------------------");
}

module.exports.tags = ["all", "fundme"]