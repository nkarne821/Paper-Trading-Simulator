import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { portfolioAPI, tradingAPI } from "../services/api";
import {
  FaBriefcase,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaSellcast,
} from "react-icons/fa";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellModal, setSellModal] = useState(null);
  const [sellQty, setSellQty] = useState(1);
  const [sellLoading, setSellLoading] = useState(false);
  const [sellError, setSellError] = useState("");
  const [sellSuccess, setSellSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio();
      setPortfolio(response.data.data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const openSellModal = (holding) => {
    setSellModal(holding);
    setSellQty(1);
    setSellError("");
    setSellSuccess("");
  };

  const closeSellModal = () => {
    setSellModal(null);
    setSellQty(1);
    setSellError("");
    setSellSuccess("");
  };

  const handleSell = async () => {
    setSellError("");
    setSellSuccess("");
    setSellLoading(true);

    try {
      const request = {
        symbol: sellModal.symbol,
        companyName: sellModal.companyName,
        transactionType: "SELL",
        quantity: parseInt(sellQty),
        price: sellModal.currentPrice,
      };

      await tradingAPI.sell(request);
      setSellSuccess(
        `Successfully sold ${sellQty} shares of ${sellModal.symbol}!`,
      );

      setTimeout(() => {
        closeSellModal();
        fetchPortfolio();
      }, 1500);
    } catch (err) {
      setSellError(
        err.response?.data?.message || "Sell failed. Please try again.",
      );
    } finally {
      setSellLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value || 0);
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

  if (!portfolio) return null;

  return (
    <div>
      <h4 className="fw-bold mb-4">My Portfolio</h4>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon green">
              <FaBriefcase />
            </div>
            <h6 className="text-muted mb-1">Cash Balance</h6>
            <h4 className="fw-bold">{formatCurrency(portfolio.cashBalance)}</h4>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon blue">
              <FaChartLine />
            </div>
            <h6 className="text-muted mb-1">Total Invested</h6>
            <h4 className="fw-bold">
              {formatCurrency(portfolio.totalInvested)}
            </h4>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon purple">
              <FaBriefcase />
            </div>
            <h6 className="text-muted mb-1">Total Value</h6>
            <h4 className="fw-bold">{formatCurrency(portfolio.totalValue)}</h4>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card">
            <div
              className={`card-icon ${portfolio.totalProfitLoss >= 0 ? "green" : "red"}`}
            >
              {portfolio.totalProfitLoss >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            </div>
            <h6 className="text-muted mb-1">Total P&L</h6>
            <h4
              className={`fw-bold ${portfolio.totalProfitLoss >= 0 ? "profit" : "loss"}`}
            >
              {formatCurrency(portfolio.totalProfitLoss)}
            </h4>
          </div>
        </div>
      </div>

      {/* Holdings Table - Full Width */}
      <div className="dashboard-card">
        <h5 className="fw-bold mb-3">Holdings</h5>
        <div className="table-responsive">
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Qty</th>
                <th>Avg Buy Price</th>
                <th>Current Price</th>
                <th>Total Invested</th>
                <th>Current Value</th>
                <th>P&L</th>
                <th>P&L %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings?.length > 0 ? (
                portfolio.holdings.map((holding) => (
                  <tr key={holding.id}>
                    <td
                      className="fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/stocks/${holding.symbol}`)}
                    >
                      {holding.symbol}
                    </td>
                    <td>{holding.companyName}</td>
                    <td>{holding.quantity}</td>
                    <td>{formatCurrency(holding.avgBuyPrice)}</td>
                    <td>{formatCurrency(holding.currentPrice)}</td>
                    <td>{formatCurrency(holding.totalInvested)}</td>
                    <td>{formatCurrency(holding.currentValue)}</td>
                    <td className={holding.profitLoss >= 0 ? "profit" : "loss"}>
                      {formatCurrency(holding.profitLoss)}
                    </td>
                    <td className={holding.profitLoss >= 0 ? "profit" : "loss"}>
                      {parseFloat(holding.profitLossPercent).toFixed(2)}%
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger-custom"
                        onClick={() => openSellModal(holding)}
                      >
                        <FaSellcast /> Sell
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center text-muted py-4">
                    No holdings yet. Start trading to build your portfolio!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sell Modal */}
      {sellModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Sell {sellModal.symbol}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeSellModal}
                ></button>
              </div>
              <div className="modal-body">
                {sellError && (
                  <div className="alert alert-danger">{sellError}</div>
                )}
                {sellSuccess && (
                  <div className="alert alert-success">{sellSuccess}</div>
                )}

                <div className="mb-3">
                  <label className="form-label">Current Price</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatCurrency(sellModal.currentPrice)}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Available Quantity</label>
                  <input
                    type="text"
                    className="form-control"
                    value={sellModal.quantity}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Quantity to Sell</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={sellModal.quantity}
                    value={sellQty}
                    onChange={(e) =>
                      setSellQty(
                        Math.min(
                          Math.max(1, parseInt(e.target.value) || 1),
                          sellModal.quantity,
                        ),
                      )
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Total Amount You Will Receive
                  </label>
                  <input
                    type="text"
                    className="form-control fw-bold"
                    value={formatCurrency(sellModal.currentPrice * sellQty)}
                    disabled
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger-custom"
                  onClick={handleSell}
                  disabled={sellLoading}
                >
                  {sellLoading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <>
                      <FaSellcast /> Confirm Sell
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={closeSellModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
