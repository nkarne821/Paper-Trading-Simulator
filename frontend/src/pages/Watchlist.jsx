import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { watchlistAPI, stockAPI } from '../services/api';
import { FaEye, FaTrash, FaArrowUp, FaArrowDown, FaChartLine } from 'react-icons/fa';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await watchlistAPI.getWatchlist();
      setWatchlist(response.data.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await watchlistAPI.remove(symbol);
      fetchWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
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

  return (
    <div>
      <h4 className="fw-bold mb-4">My Watchlist</h4>

      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Price</th>
                <th>Change</th>
                <th>Change %</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist?.items?.map((item) => (
                <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/stocks/${item.symbol}`)}>
                  <td className="fw-bold">{item.symbol}</td>
                  <td>{item.companyName}</td>
                  <td>{formatCurrency(item.currentPrice)}</td>
                  <td className={item.dayChange >= 0 ? 'profit' : 'loss'}>
                    <div className="d-flex align-items-center gap-1">
                      {item.dayChange >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                      {formatCurrency(Math.abs(item.dayChange))}
                    </div>
                  </td>
                  <td className={item.dayChange >= 0 ? 'profit' : 'loss'}>
                    {parseFloat(item.dayChangePercent).toFixed(2)}%
                  </td>
                  <td><small className="text-muted">{item.notes || '-'}</small></td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.symbol);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Your watchlist is empty. Add stocks to track them!
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

export default Watchlist;