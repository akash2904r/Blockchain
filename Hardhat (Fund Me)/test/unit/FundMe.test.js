const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

const { developmentChains } = require("../../helper-hardhat-config");

// Runs tests only on the local network
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
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

            describe("withdraw", function () {
                beforeEach(async function () {
                    await fundMe.fund({ value: sendValue });
                })
                it("Withdraw ETH from a single funder", async function () {
                    // Intial balance of both FundMe contract and deployer
                    const initialFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                    const initialDeployerBalance = await fundMe.provider.getBalance(deployer);
                    // Withdrawing ETH from the FundMe contract
                    const txResponse = await fundMe.withdraw();
                    const txReceipt = await txResponse.wait(1);
                    const { gasUsed, effectiveGasPrice } = txReceipt;
                    const gasCost = gasUsed.mul(effectiveGasPrice);
                    // Final balance of both FundMe contract and deployer
                    const finalFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                    const finalDeployerBalance = await fundMe.provider.getBalance(deployer);
                    // Assertions
                    assert.equal(finalFundMeBalance, 0);
                    assert.equal(
                        initialFundMeBalance.add(initialDeployerBalance).toString(),
                        finalDeployerBalance.add(gasCost).toString()
                    );
                })
                it("Allows us to withdraw funds funded by multiple funders", async function () {
                    // Fetching the multiple accounts provided by hardhat
                    const accounts = await ethers.getSigners();
                    // Looping through the accounts and funding the contract
                    for (let i = 1; i < 6; i++) {
                        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                        await fundMeConnectedContract.fund({ value: sendValue });
                    }
                    // Intial balance of both FundMe contract and deployer
                    const initialFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                    const initialDeployerBalance = await fundMe.provider.getBalance(deployer);
                    // Withdrawing ETH from the FundMe contract
                    const txResponse = await fundMe.withdraw();
                    const txReceipt = await txResponse.wait(1);
                    const { gasUsed, effectiveGasPrice } = txReceipt;
                    const gasCost = gasUsed.mul(effectiveGasPrice);
                    // Final balance of both FundMe contract and deployer
                    const finalFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                    const finalDeployerBalance = await fundMe.provider.getBalance(deployer);
                    // Assertions
                    assert.equal(finalFundMeBalance, 0);
                    assert.equal(
                        initialFundMeBalance.add(initialDeployerBalance).toString(),
                        finalDeployerBalance.add(gasCost).toString()
                    );
                    // Checking whether the funders array is updated properly
                    await expect(fundMe.funders(0)).to.be.reverted;
                    // Checking whether the amount funded mapping is updated properly
                    for (let i = 1; i < 6; i++) {
                        assert(await fundMe.addressToAmountFunded(accounts[i].address), 0);
                    }
                })
                // Testing the onlyOwner modifier
                it("Allows only the owner to withdraw", async function () {
                    const accounts = await ethers.getSigners();
                    const fundMeConnectedContract = await fundMe.connect(accounts[1]);
                    await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner");
                })
            })
      })