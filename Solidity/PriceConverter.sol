// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {

    function getPrice() public view returns(uint256) {
        // ABI => AggregatorV3Interface
        // Address => 0x694AA1769357215DE4FAC081bf1f309aDC325306
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        /*
            (
                uint80 roundID, int price, uint startedAt,
                uint timeStamp, uint80 answeredInRound
            ) = priceFeed.latestRoundData();
        */
        (,int256 price,,,) = priceFeed.latestRoundData();
        // ETH in terms of USD i.e., the price returned has 8 decimal places
        // Whereas the msg.value has 18 decimal places i.e., 1 ETH = 1e18 Wei
        // Therefore, we do something like the following inorder to tally this
        // Since msg.value is a uint256, we need to typecast before returning the value
        return uint256(price * 1e10);
    }

    function getConversionRate(uint256 ethAmount) public view returns(uint256) {
        uint256 ethPrice = getPrice();
        /*
            - Assuming ETH Price --> 3000 USD / ETH
            - Implies that ethPrice = 3000_000000000000000000
            - Assuming ETH Amount --> 1 ETH => 1_000000000000000000

            - Then, ethAmountInUSD = (3000e18 * 1e18) / 1e18  == 3000e18
        */
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUSD;
    }
}