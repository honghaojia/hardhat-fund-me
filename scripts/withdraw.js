const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const deployer = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("Fundme", deployer)
    console.log("withdraw contract...")
    const contractReponse = await fundMe.cheaperWithdraw()
    await contractReponse.wait(1)
    console.log("Withdraw successfully !")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
