import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constant";

//create react context
const TransactionContext = createContext();

const { ethereum } = window;

//fetch ethereum contract
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  console.log({
    provider,
    signer,
    transactionContract,
  });
  return transactionContract;
};

const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const getAllTransactions = async () => {
    try {
      if(!ethereum) return alert('Please install metamask');
      const transactionContract = getEthereumContract();


      const availableTransactions = await transactionContract.getAllTransactions()

      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        keyword: transaction.keyword,
        message: transaction.message,
        amount: parseInt(transaction.amount._hex) / (10 ** 18),
      }))
      setTransactions(structuredTransactions)
    } catch (error) {
      console.log(error);      
    }
  }
  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert("Please install metamask");
    const accounts = await ethereum.request({ method: "eth_accounts" });

    //console.log(accounts);
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      //send Eth
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          },
        ],
      });
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        keyword,
        message,
      );
      await transactionHash.wait();
      setIsLoading(true);
      // console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      // console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
      window.reload()
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum Object");
    }
  };

  const checkIfTransactionExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();
      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum Object");
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions()
      } else {
        console.log("No account found");
      }
      //console.log(accounts);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum Object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionExist()
  }, []);
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        setFormData,
        sendTransaction,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };
