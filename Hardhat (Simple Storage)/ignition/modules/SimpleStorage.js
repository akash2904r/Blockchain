const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleStorageModule", (m) => {
    const simpleStorageContract = m.contract("SimpleStorage");

    m.call(simpleStorageContract, "retrieve");

    m.call(simpleStorageContract, "store", [5]);

    return { simpleStorageContract };
})