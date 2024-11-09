// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract SafeMathTester {
    /*
        - In solidity versions less than and equal to 0.6.7, this is unchecked
        - In case, if the add method is called then the value is updated to 0 from 255
        - This happens because
            - The biggest number that can be stored in a uint8 is nothing but 255
            - That is, 8 bits --> 11111111 --> 255
            - And when there is an overflow, it just updates it to the least value it can store i.e., 0
        
        - Similarly, if we use an int8, we can store values ranging from -128 to 127
        - Assuming the bigNumber is an int8 and has the value of 127
        - Now, if we run the add() method on it, the value would be updated to -128
    */
    uint8 public bigNumber = 255;

    function add() public {
        bigNumber = bigNumber + 1;
    }
}

/****************************************************************************************

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SafeMathTester {
    uint8 public bigNumber = 255;

    // The content within a unchecked block is not checked 
    // Therefore has a similar output as the solidity versions before 0.6.7
    // That is, the bigNumber is updated to 0
    function add() public {
        unchecked {
            bigNumber = bigNumber + 1;
        }
    }
}

*/