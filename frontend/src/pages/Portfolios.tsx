import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Eye, AlertCircle } from "lucide-react";

interface Portfolio {
  portfolio_id: number;
  investor_id: number;
  portfolio_name: string;
  initial_investment: number;
  status: string;
  total_value: number;
}

function Portfolios() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null,
  );
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newInitialInvestment, setNewInitialInvestment] = useState(0);
  const [newInvestorId, setNewInvestorId] = useState<number>(1); // Assuming you have an investor id
  const [newStatus, setNewStatus] = useState("Active");
  const queryClient = useQueryClient();

  // Fetch portfolios
  const { data: portfolios, isLoading } = useQuery<Portfolio[]>({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/get-portfolios");
      return response.json();
    },
  });

  // Add portfolio mutation
  const addMutation = useMutation({
    mutationFn: async (newPortfolio: {
      name: string;
      initialInvestment: number;
      investorId: number;
      status: string;
    }) => {
      const response = await fetch("http://localhost:3001/add-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investor_id: newPortfolio.investorId,
          portfolio_name: newPortfolio.name,
          initial_investment: newPortfolio.initialInvestment,
          status: newPortfolio.status,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add portfolio");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      setNewPortfolioName("");
      setNewInitialInvestment(0);
      setNewInvestorId(1); // Reset to default
      setNewStatus("Active"); // Reset to default
    },
  });

  // Delete portfolio mutation
  const deleteMutation = useMutation({
    mutationFn: async (portfolioId: number) => {
      const response = await fetch(
        `http://localhost:3001/delete-portfolio/${portfolioId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete portfolio");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      setDeleteModalOpen(false);
    },
  });

  const handleAddPortfolio = () => {
    if (newPortfolioName && newInitialInvestment > 0) {
      addMutation.mutate({
        name: newPortfolioName,
        initialInvestment: newInitialInvestment,
        investorId: newInvestorId,
        status: newStatus,
      });
    }
  };

  const handleDelete = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPortfolio) {
      deleteMutation.mutate(selectedPortfolio.portfolio_id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Portfolios</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Portfolio Name"
            className="px-3 py-2 border rounded-lg"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Initial Investment"
            className="px-3 py-2 border rounded-lg"
            value={newInitialInvestment}
            onChange={(e) => setNewInitialInvestment(Number(e.target.value))}
          />
          <select
            className="px-3 py-2 border rounded-lg"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={handleAddPortfolio}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Add Portfolio
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portfolio Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Initial Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading portfolios...
                  </td>
                </tr>
              ) : (
                portfolios?.map((portfolio) => (
                  <tr key={portfolio.portfolio_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {portfolio.portfolio_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${portfolio.total_value?.toLocaleString() || "0"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${portfolio.initial_investment.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-emerald-600 font-medium">
                        {(
                          ((portfolio.total_value -
                            portfolio.initial_investment) /
                            portfolio.initial_investment) *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${portfolio.status === "Active" ? "text-green-600" : "text-red-600"}`}
                      >
                        {portfolio.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        onClick={() => {
                          /* View details */
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(portfolio)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Delete Portfolio
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this portfolio? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolios;
