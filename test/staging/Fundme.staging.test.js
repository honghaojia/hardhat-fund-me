const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../networkhelper")
const { assert, expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fundme", async function () {
          let deployer
          let fundMe
          const sendValue = "20000000000000000"
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("Fundme", deployer)
          })
          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.cheaperWithdraw()
              const fundmeAdress = await fundMe.getAddress()
              const endingFundmeBalance = await ethers.provider.getBalance(
                  fundmeAdress
              )
              assert.equal(endingFundmeBalance.toString(), "0")
          })
      })
