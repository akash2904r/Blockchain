// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughETH();
error Raffle__TransferFailed();

contract Raffle is VRFConsumerBaseV2 {
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    address private s_recentWinner;

    // Good Practice: Name events with the function name reversed
    // An event can have utmost 3 indexed variables
    // Indexed variables are also called as topics
    // Indexed variables are easy to get, but inorder to get the other data we might need the contract abi
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor (
        address vrfCoordinatorV2, 
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETH();
        }
        s_players.push(payable(msg.sender));
        // Emit an event when we update the dynamic array i.e., players
        emit RaffleEnter(msg.sender);
    }

    function requestRandomWinner() external {
        // Request a random number
        // After receiving it, do something with it
        // 2 transaction process
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, // The maximum gas price you are willing to pay for a request in wei
            i_subscriptionId, // The subscription ID that this contract uses for funding requests
            REQUEST_CONFIRMATIONS, // How many confirmations the Chainlink node should wait before responding
            i_callbackGasLimit, // The limit for how much gas to use for the callback request
            NUM_WORDS // How many random numbers we want
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /* requestId */, 
        uint256[] memory randomWords
    ) internal override {
        /*
            Assuming the following are the data we have:
            - s_players i.e., No. of players = 10
            - The random number returned = 202
            - Using the modulo operator we can choose a random winner i.e.,
                =>    202 % 10 = 2
            - The modulo operator always returns a value starting from 0 to 1 less than the right operand i.e., 0-9 (the array indeces)
        */
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        // Sending the money to the recent winner
        (bool success, ) = recentWinner.call{ value: address(this).balance }("");
        if (!success) revert Raffle__TransferFailed();
        emit WinnerPicked(recentWinner);
    }

    function getEntranceFee() public view returns(uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns(address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns(address) {
        return s_recentWinner;
    }
}