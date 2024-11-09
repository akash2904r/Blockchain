// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

/*
    Chainlink and Oracles

    - Smart contracts are unable to connect with external systems, APIs or any other off-chain resources on their own
    - This is because smart contracts are deterministic by design
        - Deterministic means say uint256 value = 1; then all the nodes will have the same value
        - Non-deterministic means value could be something like random(), api_call() or even 1
        - In case of non-deterministic the value is variable therefore the nodes can never reach consensus

    - An oracle is any device that interacts with the off-chain world to provide external data or computation to smart contracts
    - In case we use an centeralized oracle then we are re-introducing a point of failure
    - Therefore chainlink comes into play, chainlink is a modular decentralized oracle network that brings off-chain resources or external computation back to smart contracts
*/

import "./PriceConverter.sol";

// Inorder to optimize the gas efficiency, we can use custom errors instead of require
error NotOwner();

contract FundMe {
    /*
        Reverting example

        Assuming we have an global variable say,
        uint256 public number;

        function fund() public payable {
            number = 5;
            require(msg.value > 1e18, "Didn't send enough !!!");
        }

        - 1ETH ==   1 * 10 ** 18   == 1000000000000000000 wei
        - msg.value contains the amount of eth sent by the user who invoked fund() method
        - require is a special function which contains a boolean expression and a error message
        - In case, the boolean expression becomes false then it reverts back

        - In the above case, gas is spent on the computation for assigning number as 5
        - Then when the require condition becomes false, the number is set once again to previous value ( i.e., 0 in this case )
        - So the fund() method does cost gas even if sent with less amount of eth and the eth that remains after computation is sent back
    */

    using PriceConverter for uint256;

    // If we assign a vairable once outside a function and never change it
    // If it is assigned at compile time then we can add the constant keyword
    // When the constant keyword is used on a variable, it does not take up a spot in the storage
    // Ultimately reducing the cost of deplying the contract
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // immutable is similar to constant keyword
    // Whenever we declared an immutable variable it is a good convention to start the variable name with a i_
    // immutable keyword is used for the variable that are set once but not in the same line they are declared
    // As we can see that the i_owner variable is set in the constructor() and not in the same line where it is declared
    address public immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }

    // The functions with this particular modifier specified can only be called by the owner
    // If anybody other than the owner calls the function then it is reverted back
    // The _ (underscore) represents the rest of code i.e., the function's code
    modifier onlyOwner {
        /*
            require(msg.sender == i_owner, "Sender is not the owner !!!");

            The above written require statement is less efficient when compared to the below written custom error logic
        */
        if(msg.sender == i_owner) revert NotOwner();
        _;
    }

    function fund() public payable {
        // Since msg.value is an uint256, we can directing use the getConversionRate() method on it
        // The msg.value is considered as the first parameter of the getConversionRate() i.e., ethAmount
        require(msg.value.getConversionRate() >= MINIMUM_USD, "Didn't send enough !!!");
        addressToAmountFunded[msg.sender] = msg.value;
        funders.push(msg.sender);
    }

    function getVersion() public view returns(uint256) {
        // ETH / USD price feed address of Sepolia Network.
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        return priceFeed.version();
    }

    function withdraw() public onlyOwner {
        // Resetting the addressToAmountFunded mapping
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // Resetting the funders array
        funders = new address[](0);

        // Actual withdrawing logic

        // // transfer -> Costs 2300 gas and if failed to transfer, throws an error
        // payable(msg.sender).transfer(address(this).balance);

        // // send -> Costs 2300 gas and returns an boolean specifying the status of tx
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Failed to send !!!");

        // call -> Forwards all gas or set gas 
        // (bool callSuccess, bytes memory dataReturned) => Return values
        // Returns an boolean similar to send method along with any data that is being sent back
        (bool callSuccess, ) = payable(msg.sender).call{ value: address(this).balance }("");
        require(callSuccess, "Call failed !!!");
    }

    // In case, if someone sends ETH to the contract without calling fund() method
    receive() external payable { 
        fund();
    }

    fallback() external payable { 
        fund();
    }
}