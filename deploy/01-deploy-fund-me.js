// function deployFunc() {}
// module.exports.default = deployFunc

const { network } = require("hardhat")
const { developmentChains, chainId2chainName } = require("../networkhelper")
const { verify } = require("../utils/verify")

//用于告诉程序按照本地代理链接网络
const { ProxyAgent, setGlobalDispatcher } = require("undici")
const proxyAgent = new ProxyAgent("http://172.26.80.1:7890")
setGlobalDispatcher(proxyAgent)

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const fundMe = await deploy("Fundme", {
        from: deployer,
        args: [],
        log: true,
        chainId: chainId,
        waitConformations: network.config.blockConfirmations || 1,
    })
    if (developmentChains.includes(network.name)) {
        log("Local network detected ! Depolying...")
    } else {
        log("Test network detected ! Depolying...")
    }

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, [])
    }
    log("--------------------------------------")
}

module.exports.tags = ["all", "localhost"]
