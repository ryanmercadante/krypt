import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Transactions__factory } from '../../../smart_contract/typechain'
import { CONTRACT_ADDRESS } from '../utils/constants'

interface TransactionContextValues {
  currentAccount: string
  setCurrentAccount?: React.Dispatch<React.SetStateAction<string>>
  connectWallet: () => Promise<void>
}

export const TransactionContext = React.createContext<
  Partial<TransactionContextValues>
>({})

const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionContract = Transactions__factory.connect(
    CONTRACT_ADDRESS,
    signer
  )

  console.log({ provider, signer, transactionContract })
}

export const TransactionProvider: React.FC = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert('Please install MetaMask!')

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setCurrentAccount(accounts[0])

        // getAllTransactions()
      } else {
        console.log('No accounts found')
      }
    } catch (err) {
      console.error(err)

      throw new Error('No ethereum object.')
    }
  }

  const connectWallet = async () => {
    if (!ethereum) return alert('Please install MetaMask!')

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (err) {
      console.error(err)

      throw new Error('No ethereum object.')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <TransactionContext.Provider value={{ currentAccount, connectWallet }}>
      {children}
    </TransactionContext.Provider>
  )
}
