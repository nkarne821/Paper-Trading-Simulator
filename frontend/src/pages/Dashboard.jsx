import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../services/api";
import {
  FaWallet,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaBell,
  FaBox,
  FaChartLine,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
);

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboard(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
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

  const formatPercent = (value) => {
    const num = parseFloat(value);
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
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

  if (!dashboard) return null;

  const allocationData = {
    labels: ["Cash", "Invested"],
    datasets: [
      {
        data: [dashboard.cashBalance, dashboard.portfolioValue],
        backgroundColor: ["#667eea", "#00d4aa"],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [
          dashboard.totalValue - (dashboard.dailyProfitLoss || 0) * 4,
          dashboard.totalValue - (dashboard.dailyProfitLoss || 0) * 3,
          dashboard.totalValue - (dashboard.dailyProfitLoss || 0) * 2,
          dashboard.totalValue - (dashboard.dailyProfitLoss || 0),
          dashboard.totalValue,
        ],
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const isProfit = (dashboard.totalProfitLoss || 0) >= 0;
  const isDailyProfit = (dashboard.dailyProfitLoss || 0) >= 0;

  return (
    <div>
      <h4 className="fw-bold mb-4">Dashboard</h4>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-4 col-xl-2">
          <div className="dashboard-card">
            <div className="card-icon green">
              <FaWallet />
            </div>
            <h6 className="text-muted mb-1">Cash Balance</h6>
            <h4 className="fw-bold mb-0">
              {formatCurrency(dashboard.cashBalance)}
            </h4>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 col-xl-2">
          <div className="dashboard-card">
            <div className="card-icon blue">
              <FaChartPie />
            </div>
            <h6 className="text-muted mb-1">Portfolio Value</h6>
            <h4 className="fw-bold mb-0">
              {formatCurrency(dashboard.portfolioValue)}
            </h4>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 col-xl-2">
          <div className="dashboard-card">
            <div className="card-icon purple">
              <FaBox />
            </div>
            <h6 className="text-muted mb-1">Total Value</h6>
            <h4 className="fw-bold mb-0">
              {formatCurrency(dashboard.totalValue)}
            </h4>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 col-xl-2">
          <div className="dashboard-card">
            <div className={`card-icon ${isProfit ? "green" : "red"}`}>
              {isProfit ? <FaArrowUp /> : <FaArrowDown />}
            </div>
            <h6 className="text-muted mb-1">Total P&L</h6>
            <h4 className={`fw-bold mb-0 ${isProfit ? "profit" : "loss"}`}>
              {formatCurrency(dashboard.totalProfitLoss)}
            </h4>
            <small className={`${isProfit ? "profit" : "loss"}`}>
              {formatPercent(dashboard.totalProfitLossPercent)}
            </small>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 col-xl-2">
          <div className="dashboard-card">
            <div className={`card-icon ${isDailyProfit ? "green" : "red"}`}>
              {isDailyProfit ? <FaArrowUp /> : <FaArrowDown />}
            </div>
            <h6 className="text-muted mb-1">Daily P&L</h6>
            <h4 className={`fw-bold mb-0 ${isDailyProfit ? "profit" : "loss"}`}>
              {formatCurrency(dashboard.dailyProfitLoss)}
            </h4>
            <small className={`${isDailyProfit ? "profit" : "loss"}`}>
              {formatPercent(dashboard.dailyProfitLossPercent)}
            </small>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 col-xl-2">
          <div className="dashboard-card">
            <div className="card-icon orange">
              <FaExchangeAlt />
            </div>
            <h6 className="text-muted mb-1">Holdings</h6>
            <h4 className="fw-bold mb-0">{dashboard.totalHoldings}</h4>
            <small className="text-muted">
              {dashboard.totalTransactions} transactions
            </small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Top Holdings</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/portfolio")}
              >
                View All
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Current</th>
                    <th>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.topHoldings?.map((holding) => (
                    <tr
                      key={holding.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/stocks/${holding.symbol}`)}
                    >
                      <td>
                        <div className="fw-medium">{holding.symbol}</div>
                        <small className="text-muted">
                          {holding.companyName}
                        </small>
                      </td>
                      <td>{holding.quantity}</td>
                      <td>{formatCurrency(holding.currentPrice)}</td>
                      <td
                        className={holding.profitLoss >= 0 ? "profit" : "loss"}
                      >
                        {formatCurrency(holding.profitLoss)}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No holdings yet. Start trading!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Transactions</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/transactions")}
              >
                View All
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentTransactions?.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <span
                          className={`badge ${tx.transactionType === "BUY" ? "bg-success" : "bg-danger"}`}
                        >
                          {tx.transactionType}
                        </span>
                      </td>
                      <td>
                        <div className="fw-medium">{tx.symbol}</div>
                        <small className="text-muted">{tx.companyName}</small>
                      </td>
                      <td>{tx.quantity}</td>
                      <td className="fw-medium">
                        {formatCurrency(tx.totalAmount)}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No transactions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Market Overview</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/stocks")}
              >
                View All Stocks
              </button>
            </div>
            <div className="row g-3">
              {dashboard.marketOverview?.map((stock) => (
                <div key={stock.symbol} className="col-md-6 col-lg-3">
                  <div
                    className="stock-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/stocks/${stock.symbol}`)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-0">{stock.symbol}</h6>
                        <small className="text-muted">
                          {stock.companyName}
                        </small>
                      </div>
                      <span
                        className={`badge ${stock.change >= 0 ? "bg-success" : "bg-danger"}`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {parseFloat(stock.changePercent).toFixed(2)}%
                      </span>
                    </div>
                    <h5 className="fw-bold mb-0">
                      {formatCurrency(stock.currentPrice)}
                    </h5>
                    <small className="text-muted">
                      Vol: {(stock.volume / 1000000).toFixed(1)}M
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
