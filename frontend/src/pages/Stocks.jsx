import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { stockAPI } from '../services/api';
import { FaSearch, FaArrowUp, FaArrowDown, FaEye, FaChartLine } from 'react-icons/fa';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchStocks();
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
      handleSearch(search);
    }
  }, [searchParams]);

  const fetchStocks = async () => {
    try {
      const response = await stockAPI.getAllStocks();
      setStocks(response.data.data);
      setFilteredStocks(response.data.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStocks(stocks);
      return;
    }
    try {
      const response = await stockAPI.search(query);
      setFilteredStocks(response.data.data);
    } catch (error) {
      console.error('Error searching stocks:', error);
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
      <h4 className="fw-bold mb-4">Stock Market</h4>

      <div className="dashboard-card mb-4">
        <div className="d-flex gap-3">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by symbol or company name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

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
                <th>Volume</th>
                <th>Market Cap</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.symbol} style={{ cursor: 'pointer' }} onClick={() => navigate(`/stocks/${stock.symbol}`)}>
                  <td>
                    <div className="fw-bold">{stock.symbol}</div>
                  </td>
                  <td>
                    <div className="fw-medium">{stock.companyName}</div>
                  </td>
                  <td className="fw-bold">{formatCurrency(stock.currentPrice)}</td>
                  <td className={stock.change >= 0 ? 'profit' : 'loss'}>
                    <div className="d-flex align-items-center gap-1">
                      {stock.change >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                      {formatCurrency(Math.abs(stock.change))}
                    </div>
                  </td>
                  <td className={stock.change >= 0 ? 'profit' : 'loss'}>
                    {parseFloat(stock.changePercent).toFixed(2)}%
                  </td>
                  <td>{(stock.volume / 1000000).toFixed(1)}M</td>
                  <td>{(stock.marketCap / 1000000000).toFixed(1)}B</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/stocks/${stock.symbol}`);
                      }}
                    >
                      <FaChartLine /> Trade
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStocks.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No stocks found matching your search.
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

export default Stocks;