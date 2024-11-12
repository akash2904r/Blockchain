// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();   // Better practice i.e., using the contract name before the error name

/** @title A contract for crowd funding
 *  @author Akash
 *  @notice This contract is a demo for a sample funding contract
 *  @dev This contract implements price feeds as our library i.e., PriceConverter
 */
contract FundMe {
    using PriceConverter for uint256;

    /*
        Solidity Best Practices
        
        * Whenever declaring a state variable, it is recommended to set it's name with a prefix of s_ (for e.g., s_funders, s_addressToAmountFunded etc.)
        * Whenever declaring constant variables, set it's name in caps
        * Similar to state variables, immutable variables name are recommended to start with a prefix of i_ (for e.g., i_owner)
        
        Gas Optimization tips

        * State variables like funders, addressToAmountFunded, priceFeed are not necessary to have a public visibility
        * We could just set the visibility to private and create a getter function for them
        * The owner is not a necessary data for the users, so we could just keep it's visibility private without any getter function for it
        * We could use custom errors instead of require() to optimize the gas
    */

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;
    AggregatorV3Interface public priceFeed;

    /* Functions Order:
     *  constructor
     *  receive
     *  fallback
     *  external
     *  public
     *  internal
     *  private
     *  view / pure
     */

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier onlyOwner {
        if(msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "Didn't send enough !!!");
        addressToAmountFunded[msg.sender] = msg.value;
        funders.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{ value: address(this).balance }("");
        require(callSuccess, "Call failed !!!");
    }

    /*
        This withdraw function costs less gas when compared to the above function
        
        REASON: In the above function we are trying to read from the storage for every iteration,
        but the below function stores the funders array to memory and accesses data for this copy.
        Therefore reducing the gas used

        function cheaperWithdraw() public onlyOwner {
            address[] memory fndrs = funders;

            for(uint256 funderIndex = 0; funderIndex < fndrs.length; funderIndex++) {
                address funder = fndrs[funderIndex];
                addressToAmountFunded[funder] = 0;
            }
            funders = new address[](0);

            (bool callSuccess, ) = payable(msg.sender).call{ value: address(this).balance }("");
            require(callSuccess, "Call failed !!!");
        }
    */

    receive() external payable { 
        fund();
    }

    fallback() external payable { 
        fund();
    }
}