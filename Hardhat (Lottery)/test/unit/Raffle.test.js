const { assert, expect } = require("chai");
const { network, ethers, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
        let deployer, raffle, vrfCoordinatorV2Mock, raffleEntranceFee, interval;
        const chainId = network.config.chainId;

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["all"]);
            raffle = await ethers.getContract("Raffle", deployer);
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
            raffleEntranceFee = await raffle.getEntranceFee();
            interval = await raffle.getInterval();
        })

        describe("constructor", function () {
            it("Initializes the raffle correctly", async function () {
                // Ideally we make our tests have just 1 assert per it
                const raffleState = await raffle.getRaffleState();
                assert.equal(raffleState.toString(), "0");
                assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
            })
        })

        describe("enterRaffle", function () {
            it("Reverts if you don't pay enough", async function () {
                await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETH");
            })
            it("Records players when they enter", async function () {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                const playerFromContract = await raffle.getPlayer(0);
                assert.equal(playerFromContract, deployer);
            })
            it("Emits event on enter", async function () {
                await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(raffle, "RaffleEnter");
            })
            it("Doesn't allow enterance when raffle is calculating", async function () {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                // This method is used to increase the time of the network
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                // This method is used to mine a new block
                // The below two lines perform the same action but, the send method does it a bit faster
                // await network.provider.request({ method: "evm_mine", params: [] });
                await network.provider.send("evm_mine", []);
                // We pretend to be the Chainlink Keeper and call the performUpkeep method
                // Therefore the raffle state changes from open to calculating
                await raffle.performUpkeep([]);
                await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith("Raffle__NotOpen");
            })
        })
    })