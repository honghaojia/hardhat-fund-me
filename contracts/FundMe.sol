//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;

// import "./PriceConvert.sol";

error FundMe__NotOwner();

contract Fundme {
    // using PriceConverter for uint256;
    uint256 public minimumUsd = 10 * 1e18;

    address[] public funders;
    address public owner;
    mapping(address => uint256) public addressToAmountFunded;

    modifier onlyOwner() {
        if (msg.sender != owner) revert FundMe__NotOwner();
        _;
    }

    //once its set in the block constructor will be completed.
    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        uint256 miniEth = minimumUsd / 2000;
        require(msg.value > miniEth, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "withdrawfailed");
        funders = new address[](0);
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory m_funders = funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < m_funders.length;
            funderIndex++
        ) {
            address funder = m_funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "withdrawfailed");
        funders = new address[](0);
    }
}
