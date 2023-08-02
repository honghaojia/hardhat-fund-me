const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../networkhelper")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fundme", async () => {
          let fundMe
          let deployer
          const sendValue = "1000000000000000000"
          beforeEach(async function () {
              // const accounts = await ethers.getSigners()
              // const accountOne = accounts[0]
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("Fundme", deployer)
          })
          describe("constructor", async () => {
              it("Sets the owner of this contract correctly", async function () {
                  const response = await fundMe.owner()
                  assert.equal(response, deployer)
              })
          })
          describe("Fund", async function () {
              it("Falis if you don't send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didn't send enough!"
                  )
              })
              it("update the amount of funded data structure ", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.addressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.funders(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("Withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw ETH from a single founder", async function () {
                  const fundMe_address = await fundMe.getAddress()

                  const startingFundMeBalcance =
                      await ethers.provider.getBalance(fundMe_address)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  const transactionReponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionReponse.wait(1)

                  const { gasUsed, gasPrice } = transactionReceipt
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalcance = await ethers.provider.getBalance(
                      fundMe_address
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  assert.equal(endingFundMeBalcance, 0)
                  assert.equal(
                      (
                          startingFundMeBalcance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
              })
              it("allows us to withdraw with multiple funders", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  let accountsAddress = []
                  for (let i = 1; i < 6; i++) {
                      const tempAddress = await accounts[i].getAddress()

                      accountsAddress[i] = tempAddress
                      const fundmeContractConnect = await fundMe.connect(
                          accounts[i]
                      )
                      await fundmeContractConnect.fund({ value: sendValue })
                  }
                  const startingFundmeBalance =
                      await ethers.provider.getBalance(
                          await fundMe.getAddress()
                      )
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  //Act
                  const fundMeResponse = await fundMe.withdraw()
                  const fundMeReceipt = await fundMeResponse.wait(1)

                  const { gasUsed, gasPrice } = fundMeReceipt
                  const gasCost = gasUsed * gasPrice

                  const endingFundmeBalance = await ethers.provider.getBalance(
                      await fundMe.getAddress()
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  //Assert
                  assert.equal(endingFundmeBalance, 0)
                  assert.equal(
                      (
                          startingFundmeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
                  await expect(fundMe.funders(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.addressToAmountFunded(
                              accountsAddress[i]
                          ),
                          0
                      )
                  }
              })
              it("Only allows the owner to withdraw funds", async function () {
                  const accounts = await ethers.getSigners()
                  const account = accounts[1]
                  const accountConnected = await fundMe.connect(account)
                  await expect(
                      accountConnected.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
          })
      })
