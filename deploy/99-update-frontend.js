// To automatically provide contracts abi, address 
// or any other constants to frontend whenever deployed
// ABI is always same no matter what chain the contract is on
// Whereas we have to add diff contract addresses specific to chains

const { ethers, network } = require("hardhat")
const fs = require("fs")
const path = require("path")

const FRONTEND_ADDRESSES_FILE = path.join(__dirname, '..', 'client', 'constants', 'contractAddresses.json');
const FRONTEND_ABI_FILE = path.join(__dirname, '..', 'client', 'constants', 'abi.json');

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        updateContractAdresses()
        updateAbi()
    }
}

async function updateContractAdresses() {
    const lottery = await ethers.getContract("Lottery");
    const chainId = network.config.chainId.toString()

    // Reading from this file to keep all other chainI's contract addresses the same
    const currentAddresses = JSON.parse(fs.readFileSync(FRONTEND_ADDRESSES_FILE, "utf8"))

    // Changing the current chainId's contract address
    currentAddresses[chainId] = lottery.address

    // Writing back to the file
    fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

async function updateAbi() {
    const lottery = await ethers.getContract("Lottery")

    // Getting the abi
    const abi = lottery.interface.format(ethers.utils.FormatTypes.json)

    // Writing the new abi to the file
    fs.writeFileSync(FRONTEND_ABI_FILE, abi)
}

module.exports.tags = ["all", "frontend"]