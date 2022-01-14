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

interface Transaction {
  addressTo: string
  addressFrom: string
  timestamp: string
  message: string
  keyword: string
  amount: number
}

interface TransactionContextValues {
  connectWallet: () => Promise<void>
  currentAccount: string
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  sendTransaction: () => Promise<void>
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  transactions: Transaction[]
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

  return transactionContract
}

const TransactionProvider: React.FC = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setFormData] = useState<FormData>({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount')
  )
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const getAllTransactions = async () => {
    if (!ethereum) return alert('Please install MetaMask!')

    try {
      const transactionContract = getEthereumContract()
      const availableTransactions =
        await transactionContract.getAllTransactions()

      const structuredTransactions = availableTransactions.map((t) => ({
        addressTo: t.receiver,
        addressFrom: t.sender,
        timestamp: new Date(t.timestamp.toNumber() * 1000).toLocaleString(),
        message: t.message,
        keyword: t.keyword,
        amount: parseInt(t.amount._hex) / 10 ** 18,
      }))

      setTransactions(structuredTransactions)
      console.log(structuredTransactions)
    } catch (err) {
      console.error(err)

      throw new Error('No ethereum object.')
    }
  }

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert('Please install MetaMask!')

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setCurrentAccount(accounts[0])

        getAllTransactions()
      } else {
        console.log('No accounts found')
      }
    } catch (err) {
      console.error(err)

      throw new Error('No ethereum object.')
    }
  }

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract()
      const count = await transactionContract.getTransactionCount()

      window.localStorage.setItem('transactionCount', count.toString())
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
      const { addressTo, amount, keyword, message } = formData
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208', // 21_000 GWEI
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      )
      setIsLoading(true)
      console.log(`Loading - ${transactionHash.hash}`)
      await transactionHash.wait()

      setIsLoading(false)
      console.log(`Success - ${transactionHash.hash}`)

      const count = await transactionContract.getTransactionCount()
      setTransactionCount(count.toNumber().toString())
    } catch (err) {
      console.error(err)

      throw new Error('No ethereum object.')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkIfTransactionsExist()
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        isLoading,
        sendTransaction,
        setFormData,
        transactions,
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
export type { Transaction }
