import { useState } from "react";
import { getItemsReport } from "../api";
import toast from "react-hot-toast";
import { FileText, CalendarDays, Inbox } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const AdminReport = () => {
  const [reportData, setReportData] = useState(null); // Will hold the array of items
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const { getToken } = useAuth();

  // Helper to format the date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleGenerateReport = async () => {
    if (days <= 0) {
      toast.error("Please enter a number greater than zero.");
      return;
    }
    setLoading(true);
    setReportData(null); // Clear previous report
    try {
      const response = await getItemsReport(days, getToken);
      setReportData(response.data); // Store the array of objects
    } catch {
      toast.error("Could not generate the report.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate the report's date range for the header
  const getReportDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-slate-800">
        Generate Items Report
      </h1>
      <p className="text-slate-500 mb-8">
        Create a summary of all items reported within a specific time frame.
      </p>

      {/* --- Controls Section --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 7"
          />
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          <FileText size={18} />
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* --- Report Display Section --- */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading && (
                    <div className="p-10 text-center text-slate-500">Loading report...</div>
                )}

                {!loading && !reportData && (
                    <div className="p-10 text-center text-slate-400">
                        <Inbox size={48} className="mx-auto mb-4" />
                        <h3 className="font-semibold text-slate-700">Your report will appear here</h3>
                        <p>Select a time frame and click "Generate Report".</p>
                    </div>
                )}
                
                {reportData && (
                    <div>
                        <div className="p-4 bg-slate-50 border-b">
                            <h2 className="font-bold text-slate-700">Report for Last {days} Days</h2>
                            <p className="text-sm text-slate-500">{getReportDateRange()}</p>
                        </div>
                        {reportData.length === 0 ? (
                             <p className="p-10 text-center text-slate-500">No items were found in this period.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="p-4 font-semibold text-slate-600">#</th>
                                            <th className="p-4 font-semibold text-slate-600">Item Name</th>
                                            <th className="p-4 font-semibold text-slate-600">Category</th>
                                            <th className="p-4 font-semibold text-slate-600">Location</th>
                                            <th className="p-4 font-semibold text-slate-600">Listed by</th>
                                            <th className="p-4 font-semibold text-slate-600">Found on</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {reportData.map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50">
                                                <td className="p-4 text-slate-500">{index + 1}</td>
                                                <td className="p-4 font-medium text-slate-800">{item.item_name}</td>
                                                <td className="p-4 text-slate-600">{item.category}</td>
                                                <td className="p-4 text-slate-600">{item.location_found}</td>
                                                <td className="p-4 text-slate-600">{item.full_name}</td>
                                                <td className="p-4 text-slate-600">{formatDate(item.found_date)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
    </div>
  );
};

export default AdminReport;
