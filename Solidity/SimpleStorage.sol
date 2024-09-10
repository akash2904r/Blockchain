// SPDX-License-Identifier: MIT

// Uses 0.8.8 version only
pragma solidity 0.8.8;

// Uses any version that is newer than 0.8.7 or 0.8.7
// pragma solidity ^0.8.7; 

// Uses any version that is between 0.8.7 and 0.9.0
// pragma solidity >=0.8.7 <0.9.0; 


// Smart Contracts have a address of their own
// When compiled they are compiled into EVM - Ethereum Virtual Machine
contract SimpleStorage {
    // Various datatypes used in Solidity

    // bool hasFavoriteNumber = true;
    // uint256 favoriteNumber = 5;
    // string favoriteNumberInText = "Five";
    // int256 favoriteInt = -5;
    // address myAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    // bytes32 favoriteBytes = "Solidity";


    // Global Variable 
    // This gets initialized to 0
    // Automatically cached to an storage variable
    // Default visibility is internal if not specified
    // Also counted as an view function until its visibility is public
    uint256 favoriteNumber;
    Person public person = Person({ favoriteNumber: 1, name: "Akash" });

    // Similar to a dictionary data type
    // Where key -> string and value -> uint256
    mapping(string => uint256) public nameToFavoriteNumber;

    // User defined data type
    struct Person {
        uint256 favoriteNumber;
        string name; // Behind the scene (string) -> Array of bytes
    }

    // If a value is specified within the square brackers say Person[3]
    // This means that only 3 Person can be added into this people array
    // In case if it is left without specifying any values then it becomes a dynamic array and can take any number of arbitary values
    Person[] public people;

    function store(uint256 _favoriteNumber) public {
        // Gas used -> 30618
        favoriteNumber = _favoriteNumber; 

        // Gas used -> 50752
        // More gas is used since more things are to be done

        // favoriteNumber = _favoriteNumber;
        // favoriteNumber = favoriteNumber + 1;
    }

    // Functions with "view" or "pure" keywords do not cost gas
    // In case a view function is called within a non-view function then it would cost gas
    // Since they disallow modification of state
    // View functions can read state whereas Pure functions cannot read state
    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }

    // calldata, memory, storage
    // storage variables are permanent variables that can be modified
    // calldata and memory is specified for data that is being stored temporarily
    // calldata variable is used when the value of an parameter is not altered or modified
    // All the three specified keywords are applicable only for array, struct or mapping types
    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(Person(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}