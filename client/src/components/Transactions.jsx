import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import dummyData from "../utils/DummyData";
import { shortenAddress } from "../utils/shortenAddress";
import useFetch from "../hooks/useFectch";

const TransactionCard = ({
  addressTo,
  addressFrom,
  timestamp,
  message,
  keyword,
  amount,
  url,
}) => {
  const gifUrl = useFetch({ keyword });

  url =
    "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C";


  return (
    <div
      className="bg-[#181918] m-4 flex flex-1
    2xl:min-w-[450px]
    2xl:max-w-[500px]
    sm:min-w-[270px]
    sm:max-w-[300px]
    flex-col p-3 rounded-md hover:shadow-2xl
    "
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="w-full mb-6 py-2">
          <p className="text-white text-base cursor-default">
            From: {shortenAddress(addressFrom)}
          </p>

          <p className="text-white text-base cursor-default">
            To: {shortenAddress(addressTo)}
          </p>
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
        </div>
        <img
          src={gifUrl || url}
          alt="gif"
          className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
        />
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { currentAccount, transactions } = useContext(TransactionContext);
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}
        {/* {currentAccount && (
          <div className="flex flex-wrap justify-center items-center mt-10">
            {dummyData.reverse().map((transaction, i) => (
              <TransactionCard key={i} {...transaction} />
            ))}
          </div>
        )} */}
        <div className="flex flex-wrap justify-center items-center mt-10">
          {transactions.reverse().map((transaction, i) => (
            <TransactionCard key={i} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
