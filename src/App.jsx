import { useState } from "react";
import "./App.css";

function App() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!address) {
      setError("Address tidak boleh kosong!");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const lowerCaseAddress = address.toLowerCase(); // Pastikan huruf kecil

      const response = await fetch(
        `https://airdrop-api.initia.xyz/info/initia/${lowerCaseAddress}?nocache=${Date.now()}`, // Tambahkan query unik
        {
          method: "GET",
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            origin: "https://airdrop.initia.xyz",
            priority: "u=1, i",
            referer: "https://airdrop.initia.xyz/",
            "sec-ch-ua":
              '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          setError("Address tidak eligible untuk airdrop.");
        } else {
          setError(errorData.message || "Terjadi kesalahan.");
        }
        setLoading(false);
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          INITIA Airdrop Checker
        </h2>

        {/* Form Input */}
        <input
          type="text"
          placeholder="Masukkan Address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={fetchData}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Airdrop"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-md">
            ❌ {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && <p className="mt-4 text-gray-500">Fetching data...</p>}

        {/* Success Response */}
        {data && (
          <div className="mt-6 p-6 bg-white shadow-md rounded-lg w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Airdrop Data
            </h2>

            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">ID:</span>
                <p className="text-gray-800 break-all">{data.id}</p>
              </div>

              <div>
                <span className="font-medium text-gray-600">EVM ID:</span>
                <p className="text-gray-800 break-all">{data.evm_id}</p>
              </div>

              <div>
                <span className="font-medium text-gray-600">Amount:</span>
                <p className="text-blue-600 font-semibold">
                  {
                    (Number(data.amount) / 1_000_000)
                      .toFixed(6) // Pastikan ada 6 desimal
                      .replace(/0+$/, "") // Hilangkan nol di belakang
                      .replace(/\.$/, "") // Hilangkan titik jika nol semua di belakang
                  }
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">XP Rank:</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  #{data.xp_rank}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Jennie Level:</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {data.jennie_level}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Freeze 1:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    data.freeze1
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {data.freeze1 ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Freeze 2:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    data.freeze2
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {data.freeze2 ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-600">Total XP:</span>
                <p className="text-indigo-600 font-semibold">
                  {Number(data.total_xp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-6 text-gray-500 text-sm">
        Made with ❤️ @abbyestt
      </footer>
    </div>
  );
}

export default App;
