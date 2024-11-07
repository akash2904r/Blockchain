const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleStorageModule", (m) => {
    const simpleStorageContract = m.contract("SimpleStorage");

    return { simpleStorageContract };
})