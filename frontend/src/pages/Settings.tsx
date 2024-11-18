import React, { useEffect, useState } from "react";

interface Asset {
  asset_id: number;
  asset_name: string;
  asset_type: string;
  market_value: number;
  risk_level: string;
  created_at: string;
}

function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch assets from the backend when the component mounts
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-assets");
        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }
        const data = await response.json();
        setAssets(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Assets</h1>

      {isLoading ? (
        <p>Loading assets...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr key={asset.asset_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {asset.asset_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {asset.asset_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {asset.asset_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${asset.market_value.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {asset.risk_level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(asset.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Assets;
