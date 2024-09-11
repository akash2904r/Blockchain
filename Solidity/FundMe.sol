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

    uint256 public minimumUSD = 50;

    function fund() public payable {
        require(msg.value > minimumUSD, "Didn't send enough !!!");
    }

    function withdraw() {}
}