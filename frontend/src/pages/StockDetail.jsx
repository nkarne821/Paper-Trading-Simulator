import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stockAPI, tradingAPI, watchlistAPI } from '../services/api';
import { FaArrowLeft, FaArrowUp, FaArrowDown, FaShoppingCart, FaSellcast, FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StockDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tradeType, setTradeType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeError, setTradeError] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);

  // Live chart data
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const chartIntervalRef = useRef(null);

  useEffect(() => {
    fetchStock();
    checkWatchlist();

    // Initialize chart with some data
    generateInitialChartData();

    // Start live price updates for chart
    chartIntervalRef.current = setInterval(() => {
      updateLivePrice();
    }, 3000);

    return () => {
      if (chartIntervalRef.current) clearInterval(chartIntervalRef.current);
    };
  }, [symbol]);

  const fetchStock = async () => {
    try {
      const response = await stockAPI.getQuote(symbol);
      setStock(response.data.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlist = async () => {
    try {
      const response = await watchlistAPI.getWatchlist();
      const items = response.data.data.items || [];
      setInWatchlist(items.some(item => item.symbol === symbol.toUpperCase()));
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  const generateInitialChartData = () => {
    const now = new Date();
    const labels = [];
    const prices = [];

    // Generate 20 data points (last 20 minutes with 1-min intervals)
    let basePrice = 2400 + Math.random() * 1000;
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      labels.push(time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));

      // Random walk
      const change = (Math.random() - 0.5) * 20;
      basePrice += change;
      prices.push(Math.max(basePrice, 100));
    }

    setTimeLabels(labels);
    setPriceHistory(prices);
  };

  const updateLivePrice = async () => {
    try {
      const response = await stockAPI.getQuote(symbol);
      const newPrice = response.data.data.currentPrice;
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setPriceHistory(prev => {
        const newHistory = [...prev, parseFloat(newPrice)];
        if (newHistory.length > 30) newHistory.shift(); // Keep last 30 points
        return newHistory;
      });

      setTimeLabels(prev => {
        const newLabels = [...prev, timeStr];
        if (newLabels.length > 30) newLabels.shift();
        return newLabels;
      });

      setStock(response.data.data);
    } catch (error) {
      console.error('Error updating live price:', error);
    }
  };

  const handleTrade = async () => {
    setTradeError('');
    setTradeSuccess('');
    setTradeLoading(true);

    try {
      const request = {
        symbol: stock.symbol,
        companyName: stock.companyName,
        transactionType: tradeType,
        quantity: parseInt(quantity),
        price: stock.currentPrice
      };

      if (tradeType === 'BUY') {
        await tradingAPI.buy(request);
      } else {
        await tradingAPI.sell(request);
      }

      setTradeSuccess(`${tradeType} order executed successfully!`);
      setTradeType(null);
      setQuantity(1);
    } catch (err) {
      setTradeError(err.response?.data?.message || 'Trade failed. Please try again.');
    } finally {
      setTradeLoading(false);
    }
  };

  const handleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await watchlistAPI.remove(symbol);
        setInWatchlist(false);
      } else {
        await watchlistAPI.add({
          symbol: stock.symbol,
          companyName: stock.companyName
        });
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
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

  if (!stock) return null;

  const isPositive = stock.change >= 0;

  const chartData = {
    labels: timeLabels,
    datasets: [{
      label: `${stock.symbol} Price`,
      data: priceHistory,
      borderColor: isPositive ? '#00d4aa' : '#f5576c',
      backgroundColor: isPositive ? 'rgba(0, 212, 170, 0.1)' : 'rgba(245, 87, 108, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Live Price Movement',
        font: { size: 14, weight: 'bold' }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8, font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0);
          },
          font: { size: 10 }
        }
      }
    },
    animation: { duration: 0 },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div>
      <button className="btn btn-link text-decoration-none mb-3" onClick={() => navigate('/stocks')}>
        <FaArrowLeft /> Back to Stocks
      </button>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h3 className="fw-bold mb-1">{stock.symbol}</h3>
                <p className="text-muted mb-0">{stock.companyName}</p>
              </div>
              <div className="text-end">
                <h2 className={`fw-bold mb-1 ${isPositive ? 'profit' : 'loss'}`}>
                  {formatCurrency(stock.currentPrice)}
                </h2>
                <div className={`d-flex align-items-center gap-2 ${isPositive ? 'profit' : 'loss'}`}>
                  {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                  <span>{formatCurrency(Math.abs(stock.change))} ({parseFloat(stock.changePercent).toFixed(2)}%)</span>
                </div>
              </div>
            </div>

            {/* Live Price Chart */}
            <div className="mb-4" style={{ height: '320px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block">Open</small>
                  <span className="fw-bold">{formatCurrency(stock.open)}</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block">High</small>
                  <span className="fw-bold">{formatCurrency(stock.high)}</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block">Low</small>
                  <span className="fw-bold">{formatCurrency(stock.low)}</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block">Prev Close</small>
                  <span className="fw-bold">{formatCurrency(stock.previousClose)}</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block">Volume</small>
                  <span className="fw-bold">{(stock.volume / 1000000).toFixed(1)}M</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block">Market Cap</small>
                  <span className="fw-bold">{(stock.marketCap / 1000000000).toFixed(1)}B</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block">P/E Ratio</small>
                  <span className="fw-bold">{parseFloat(stock.peRatio).toFixed(2)}</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block">52W Range</small>
                  <span className="fw-bold">{formatCurrency(stock.fiftyTwoWeekLow)} - {formatCurrency(stock.fiftyTwoWeekHigh)}</span>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button className="btn btn-success-custom" onClick={() => setTradeType('BUY')}>
                <FaShoppingCart /> Buy
              </button>
              <button className="btn btn-danger-custom" onClick={() => setTradeType('SELL')}>
                <FaSellcast /> Sell
              </button>
              <button className={`btn ${inWatchlist ? 'btn-warning' : 'btn-outline-warning'}`} onClick={handleWatchlist}>
                {inWatchlist ? <><FaEyeSlash /> Remove</> : <><FaEye /> Watch</>}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {tradeType && (
            <div className="dashboard-card">
              <h5 className="fw-bold mb-3">{tradeType} {stock.symbol}</h5>

              {tradeError && <div className="alert alert-danger">{tradeError}</div>}
              {tradeSuccess && <div className="alert alert-success">{tradeSuccess}</div>}

              <div className="mb-3">
                <label className="form-label">Current Price</label>
                <input type="text" className="form-control" value={formatCurrency(stock.currentPrice)} disabled />
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Total Amount</label>
                <input
                  type="text"
                  className="form-control fw-bold"
                  value={formatCurrency(stock.currentPrice * quantity)}
                  disabled
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className={`btn w-50 ${tradeType === 'BUY' ? 'btn-success-custom' : 'btn-danger-custom'}`}
                  onClick={handleTrade}
                  disabled={tradeLoading}
                >
                  {tradeLoading ? <span className="spinner-border spinner-border-sm" /> : `Confirm ${tradeType}`}
                </button>
                <button className="btn btn-outline-secondary w-50" onClick={() => setTradeType(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetail;