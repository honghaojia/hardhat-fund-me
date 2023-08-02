//SPDX-License-Identifier:MIT

pragma solidity ^0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getUsdPrice() internal view returns (uint256) {
        //Adress 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        //ABI
        AggregatorV3Interface pricefeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        (, int256 price, , , ) = pricefeed.latestRoundData();
        return uint(price * 1e10);
    }

    function getConversionRate(
        uint256 miniUsd
    ) internal view returns (uint256) {
        uint256 UsdPrice = getUsdPrice();
        uint256 miniEth = (miniUsd * UsdPrice) / 1e18;
        return miniEth;
    }
}
