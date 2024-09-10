// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

// ExtraStorage inherits SimpleStorage
contract ExtraStorage is SimpleStorage {
    // Overriding store function from the SimpleStorage
    // Whenever we override an function we need to specific the override keyword
    // The function which is being overriden must contain the virtual keyword (in this case, store function of SimpleStorage)
    function store(uint256 _favoriteNumber) public override {
        favoriteNumber = _favoriteNumber + 5;
    }
}