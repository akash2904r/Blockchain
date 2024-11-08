const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("SimpleStorage", function () {
    let simpleStorage;

    beforeEach(async function () {
        simpleStorage = await ethers.deployContract("SimpleStorage", []);
        await simpleStorage.waitForDeployment();
    })

    it("Should start with a favourite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";
        
        // Below written two lines do the same thing
        assert.equal(currentValue.toString(), expectedValue);
        // expect(currentValue.toString()).to.equal(expectedValue);
    })

    it("Should update favourite number when we call store", async function () {
        const expectedValue = "5";
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue);
    })

    it("Should revert back to initial state", async function () {
        await expect(simpleStorage.people(0)).to.be.reverted;
    })

    it("Should return 0", async function () {
        const currentValue = await simpleStorage.nameToFavoriteNumber("Suna Pana");
        const expectedValue = "0";

        assert.equal(currentValue.toString(), expectedValue);
    })

    it("Should add a person", async function () {
        await simpleStorage.addPerson("Akash", 1);
        const currentValue1 = await simpleStorage.people(0);
        const currentValue2 = await simpleStorage.nameToFavoriteNumber("Akash");

        assert.equal(currentValue1.toString(), "1,Akash");
        assert.equal(currentValue2.toString(), "1");
    })
})