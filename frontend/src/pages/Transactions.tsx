import React, { useEffect, useState } from "react";

interface Transaction {
  transaction_id: number;
  portfolio_id: number;
  asset_id: number;
  transaction_type: string;
  transaction_date: string;
  units: string;
  price_per_unit: string;
  total_value: string;
}

function Transactions() {
  // Initialize state with null or empty string, not zero
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const [assetId, setAssetId] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<string>("Buy");
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [units, setUnits] = useState<string>(""); // Empty string, not zero
  const [pricePerUnit, setPricePerUnit] = useState<string>(""); // Empty string
  const [totalValue, setTotalValue] = useState<string>(""); // Empty string
  const [message, setMessage] = useState<string>("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle form submission to add a new transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure no null or empty values in the final submission
    if (
      portfolioId === null ||
      assetId === null ||
      !transactionDate ||
      !units ||
      !pricePerUnit ||
      !totalValue
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const newTransaction = {
      portfolio_id: portfolioId,
      asset_id: assetId,
      transaction_type: transactionType,
      transaction_date: transactionDate,
      units: parseFloat(units),
      price_per_unit: parseFloat(pricePerUnit),
      total_value: parseFloat(totalValue),
    };

    try {
      const response = await fetch("http://localhost:3001/add-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Transaction added successfully! Transaction ID: ${data.transactionId}`,
        );
        fetchTransactions(); // Re-fetch transactions after adding
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Failed to add transaction. Please try again.");
    }
  };

  // Function to fetch the updated list of transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Transactions</h1>

      {/* Add Transaction Form */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Add New Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Portfolio ID
            </label>
            <input
              type="number"
              value={portfolioId === null ? "" : portfolioId} // Allow empty string for null
              onChange={(e) => setPortfolioId(Number(e.target.value) || null)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Asset ID
            </label>
            <input
              type="number"
              value={assetId === null ? "" : assetId} // Allow empty string for null
              onChange={(e) => setAssetId(Number(e.target.value) || null)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Date
            </label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Units
            </label>
            <input
              type="number"
              step="0.0001"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price per Unit
            </label>
            <input
              type="number"
              step="0.01"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Value
            </label>
            <input
              type="number"
              step="0.01"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md"
            >
              Add Transaction
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>

      {/* Transaction List Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Transaction List
        </h2>

        {isLoading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 mt-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portfolio ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.transaction_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.portfolio_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.asset_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.transaction_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.transaction_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.units}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.price_per_unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.total_value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transactions;
