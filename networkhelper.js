const chainId2chainName = {
    11155111: {
        name: "sepolia",
    },
    31337: {
        name: "hardhat",
    },
}
const developmentChains = ["hardhat", "localhost"]
module.exports = {
    developmentChains,
    chainId2chainName,
}
