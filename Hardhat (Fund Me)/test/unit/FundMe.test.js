const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", function () {
    let fundMe, deployer, mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1");

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        // fixture() method let's us deploy multiple deploy scripts by letting us add multiple tags
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    })

    describe("constructor", function () {
        it("Sets the aggregator address correctly", async function () {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        })
    })
    
    describe("fund", function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough !!!");
        })
        it("Updates the amount funded mapping", async function () {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.addressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        })
        it("Adds funder to funders array", async function () {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.funders(0);
            assert.equal(funder, deployer);
        })
    })
})