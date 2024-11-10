const { network } = require("hardhat");
const { 
    developmentChains, 
    DECIMALS, 
    INITIAL_ANSWER 
} = require("../helper-hardhat-config");

// Mocking --> If a contract doesn't exist, we deploy a minimal version of it for our local testing
// Since our local network (i.e., hardhat or localhost) doesn't have a AggregatorV3Interface deployed, we manually deploy a mock
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...");

        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator", // Not mandatory
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });

        log("Mocks deployed!");
        log("--------------------------------------------------");
    }
}

module.exports.tags = ["all", "mocks"]