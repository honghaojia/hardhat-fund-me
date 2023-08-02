const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const deployer = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("Fundme", deployer)
    console.log("Funding contract...")
    const contractReponse = await fundMe.fund({
        value: "20000000000000000",
    })
    await contractReponse.wait(1)
    console.log("Funded")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
