const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

// Runs tests only on the testnet network
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
            let fundMe, deployer;
            const sendValue = ethers.utils.parseEther("1");

            beforeEach(async function () {
                deployer = (await getNamedAccounts()).deployer;
                fundMe = await ethers.getContract("FundMe", deployer);
            })

            it("Allows people to fund and withdraw", async function () {
                await fundMe.fund({ value: sendValue });
                await fundMe.withdraw();
                const finalBalance = await fundMe.provider.getBalance(fundMe.address);
                assert.equal(finalBalance.toString(), "0");
            })
      })