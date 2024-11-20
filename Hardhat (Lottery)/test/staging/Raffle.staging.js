const { assert, expect } = require("chai");
const { network, ethers, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
        let deployer, raffle, raffleEntranceFee;
        const chainId = network.config.chainId;

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer;
            raffle = await ethers.getContract("Raffle", deployer);
            raffleEntranceFee = await raffle.getEntranceFee();
        })

        describe("fulfillRandomWords", function () {
            it("Works with live Chainlink Keepers and Chainlink VRF and we get a random winner", async function () {
                const startingTimeStamp = await raffle.getLatestTimeStamp();
                const accounts =  await ethers.getSigners();
                // Setup the listener before entering raffle
                // Just in case, if the blockchain moves REALLY fast
                await new Promise(async (resolve, reject) => {
                    raffle.once("WinnerPicked", async () => {
                        console.log("WinnerPicked event got fired!");
                        try {
                            const recentWinner = await raffle.getRecentWinner();
                            const raffleState = await raffle.getRaffleState();
                            const winnerEndingBalance = await accounts[0].getBalance();
                            const endingTimeStamp = await raffle.getLatestTimeStamp();

                            await expect(raffle.getPlayer(0)).to.be.reverted;
                            assert.equal(recentWinner.toString(), accounts[0].address);
                            assert.equal(raffleState, 0);
                            assert.equal(
                                winnerEndingBalance.toString(),
                                winnerStartingBalance.add(raffleEntranceFee).toString()
                            );
                            assert(endingTimeStamp > startingTimeStamp);
                            resolve();
                        } catch (error) {
                            console.error(error);
                            reject(error);
                        }
                    })
                    // Entering the raffle lottery
                    await raffle.enterRaffle({ value: raffleEntranceFee });
                    const winnerStartingBalance = await accounts[0].getBalance();
                })
            })
        })
    })