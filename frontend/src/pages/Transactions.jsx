import { useState, useEffect } from "react";
import { tradingAPI } from "../services/api";
import { FaHistory, FaShoppingCart, FaSellcast } from "react-icons/fa";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await tradingAPI.getTransactions();
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    // Handle null/undefined
    if (!dateString) {
      return "N/A";
    }

    // Java LocalDateTime format: 2026-06-01T11:55:00
    // JavaScript needs ISO format with Z
    let dateStr = dateString;

    // If it contains 'T' but no timezone info, append Z to treat as UTC
    if (
      dateStr.includes("T") &&
      !dateStr.includes("Z") &&
      !dateStr.includes("+")
    ) {
      dateStr = dateStr + "Z";
    }

    const date = new Date(dateStr);

    // Check if valid date
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format to local Indian time
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4">Transaction History</h4>

      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Symbol</th>
                <th>Company</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Amount</th>
                <th>P&L</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <small>{formatDate(tx.createdAt)}</small>
                  </td>
                  <td>
                    <span
                      className={`badge ${tx.transactionType === "BUY" ? "bg-success" : "bg-danger"}`}
                    >
                      {tx.transactionType === "BUY" ? (
                        <FaShoppingCart />
                      ) : (
                        <FaSellcast />
                      )}{" "}
                      {tx.transactionType}
                    </span>
                  </td>
                  <td className="fw-bold">{tx.symbol}</td>
                  <td>{tx.companyName}</td>
                  <td>{tx.quantity}</td>
                  <td>{formatCurrency(tx.price)}</td>
                  <td className="fw-bold">{formatCurrency(tx.totalAmount)}</td>
                  <td className={tx.profitLoss >= 0 ? "profit" : "loss"}>
                    {tx.profitLoss ? formatCurrency(tx.profitLoss) : "-"}
                  </td>
                  <td>
                    <span
                      className={`badge ${tx.status === "COMPLETED" ? "bg-success" : tx.status === "PENDING" ? "bg-warning" : "bg-danger"}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    No transactions yet. Start trading to see your history!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
