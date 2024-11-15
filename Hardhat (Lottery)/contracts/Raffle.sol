// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

error Raffle__NotEnoughETH();

contract Raffle {
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    // Good Practice: Name events with the function name reversed
    event RaffleEnter(address indexed player);

    constructor (uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETH();
        }
        s_players.push(payable(msg.sender));
        // Emit an event when we update the dynamic array i.e., players
        emit RaffleEnter(msg.sender);
    }

    function getEntranceFee() public view returns(uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns(address) {
        return s_players[index];
    }
}