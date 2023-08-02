require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
require("solidity-coverage")
require("bn.js")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.19",
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: process.env.RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            blockConfirmations: 6,
        },
        // localhost:{
        //   url:
        // }
    },
    // gasReporter: {
    //     enabled: true,
    //     outputFile: "gasReport.txt",
    //     noColors: true,
    //     currency: "USD",
    //     coinmarketcap: process.env.COINMARKET_API_KEY,
    //     token: "ETH",
    // },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}
