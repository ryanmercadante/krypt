import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Transactions__factory } from '../../../smart_contract/typechain'
import { CONTRACT_ADDRESS } from '../utils/constants'

interface FormData {
  addressTo: string
  amount: string
  keyword: string
  message: string
}

interface TransactionContextValues {
  currentAccount: string
  connectWallet: () => Promise<void>
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TransactionContext = React.createContext<
  TransactionContextValues | undefined
>(undefined)

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

const TransactionProvider: React.FC = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setFormData] = useState<FormData>({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

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

  const sendTransaction = async () => {
    if (!ethereum) return alert('Please install MetaMask!')

    try {
      // get data from from
    } catch (err) {
      console.error(err)

      throw new Error('No ethereum object.')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        formData,
        setFormData,
        handleChange,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error(
      'useTransactions must be used within a TransactionsProvider'
    )
  }
  return context
}

export { TransactionProvider, useTransactions }
