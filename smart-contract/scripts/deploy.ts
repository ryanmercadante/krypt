/* eslint-disable no-process-exit */
import { ethers } from 'hardhat'

async function main() {
  // We get the contract to deploy
  const Transactions = await ethers.getContractFactory('Transactions')
  const transactions = await Transactions.deploy()

  await transactions.deployed()

  console.log('Transactions deployed to:', transactions.address)
}

async function runMain() {
  try {
    await main()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

runMain()
