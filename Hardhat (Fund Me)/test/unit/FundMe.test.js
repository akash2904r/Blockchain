const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {
    let fundMe, deployer, mockV3Aggregator;

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        // fixture() method let's us deploy multiple deploy scripts by letting us add multiple tags
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    })

    describe("constructor", () => {
        it("Sets the aggregator address correctly", async function () {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        })
    })
})