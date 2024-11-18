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

interface PortfolioAsset {
  portfolio_id: number;
  asset_id: number;
  units_owned: string;
  purchase_price: string;
  current_value: string;
  last_updated: string;
}

function Transactions() {
  // State hooks for transactions and portfolio assets
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const [assetId, setAssetId] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<string>("Buy");
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [units, setUnits] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [totalValue, setTotalValue] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  // Function to fetch transactions
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

  // Function to fetch portfolio assets
  const fetchPortfolioAssets = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-portfolio_asset");
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio assets");
      }
      const data = await response.json();
      setPortfolioAssets(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch transactions and portfolio assets on mount
  useEffect(() => {
    fetchTransactions();
    fetchPortfolioAssets();
  }, []);

  // Handle form submission for adding new transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
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
        // After successful transaction, refetch both transactions and portfolio assets
        fetchTransactions(); // Refresh transactions
        fetchPortfolioAssets(); // Refresh portfolio assets
        setShowModal(false); // Close modal after successful submission
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Failed to add transaction. Please try again.");
    }
  };

  // Render the component
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Transactions</h1>

      {/* Button to open modal */}
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md"
      >
        Add New Transaction
      </button>

      {/* Modal for Add Transaction */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Transaction
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields for transaction details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Portfolio ID
                </label>
                <input
                  type="number"
                  value={portfolioId === null ? "" : portfolioId}
                  onChange={(e) =>
                    setPortfolioId(Number(e.target.value) || null)
                  }
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
                  value={assetId === null ? "" : assetId}
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

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
                >
                  Add Transaction
                </button>
              </div>
            </form>

            {message && <p className="mt-4 text-gray-700">{message}</p>}
          </div>
        </div>
      )}

      {/* Portfolio Asset Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Portfolio Assets
        </h2>
        <table className="min-w-full mt-4 table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Portfolio ID</th>
              <th className="px-4 py-2 border border-gray-300">Asset ID</th>
              <th className="px-4 py-2 border border-gray-300">Units Owned</th>
              <th className="px-4 py-2 border border-gray-300">
                Purchase Price
              </th>
              <th className="px-4 py-2 border border-gray-300">
                Current Value
              </th>
              <th className="px-4 py-2 border border-gray-300">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {portfolioAssets.map((asset) => (
              <tr key={asset.portfolio_id + "_" + asset.asset_id}>
                <td className="px-4 py-2 border border-gray-300">
                  {asset.portfolio_id}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {asset.asset_id}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {asset.units_owned}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {asset.purchase_price}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {asset.current_value}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {asset.last_updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Transaction List Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Transaction List
        </h2>
        <table className="min-w-full mt-4 table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">
                Transaction ID
              </th>
              <th className="px-4 py-2 border border-gray-300">Portfolio ID</th>
              <th className="px-4 py-2 border border-gray-300">Asset ID</th>
              <th className="px-4 py-2 border border-gray-300">Type</th>
              <th className="px-4 py-2 border border-gray-300">Date</th>
              <th className="px-4 py-2 border border-gray-300">Units</th>
              <th className="px-4 py-2 border border-gray-300">
                Price per Unit
              </th>
              <th className="px-4 py-2 border border-gray-300">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td className="px-4 py-2 border border-gray-300">
                  {transaction.transaction_id}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {transaction.portfolio_id}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {transaction.asset_id}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {transaction.transaction_type}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {transaction.transaction_date}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {transaction.units}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {transaction.price_per_unit}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {transaction.total_value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
