// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract FallbackExample {
    uint256 public result;

    // The receive function is a special function and is executed on a call to the contract with empty calldata 
    // This function is executed on plain Ether transfers (e.g. via .send() or .transfer())
    receive() external payable {
        result = 1;
    }

    // The fallback function is also a special function
    // It is executed when the calldata sent doesn't match any function signatures (or) if the receive function isn't specified
    // The fallback function can work even when calldata is present whereas receive can't work when calldata is present
    fallback() external payable {
        result = 2;
    }
}

/*
        Ether is sent to contract
        
            is msg.data empty?
                /   \ 
               yes  no
               /     \
          receive()?  fallback() 
           /   \ 
         yes   no
        /        \
      receive()  fallback()
*/