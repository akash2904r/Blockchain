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
})