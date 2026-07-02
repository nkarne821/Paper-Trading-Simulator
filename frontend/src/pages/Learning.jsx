import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningAPI } from '../services/api';
import { FaGraduationCap, FaClock, FaEye, FaStar } from 'react-icons/fa';

const Learning = () => {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const navigate = useNavigate();

  const categories = [
    { value: 'ALL', label: 'All Articles' },
    { value: 'TRADING_BASICS', label: 'Trading Basics' },
    { value: 'INVESTING_CONCEPTS', label: 'Investing Concepts' },
    { value: 'RISK_MANAGEMENT', label: 'Risk Management' },
    { value: 'MARKET_ANALYSIS', label: 'Market Analysis' },
    { value: 'PORTFOLIO_STRATEGY', label: 'Portfolio Strategy' },
  ];

  useEffect(() => {
    fetchArticles();
    fetchFeatured();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await learningAPI.getAllArticles();
      setArticles(response.data.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await learningAPI.getFeatured();
      setFeatured(response.data.data);
    } catch (error) {
      console.error('Error fetching featured:', error);
    }
  };

  const filteredArticles = activeCategory === 'ALL' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const getCategoryColor = (category) => {
    const colors = {
      'TRADING_BASICS': 'primary',
      'INVESTING_CONCEPTS': 'success',
      'RISK_MANAGEMENT': 'danger',
      'MARKET_ANALYSIS': 'info',
      'PORTFOLIO_STRATEGY': 'warning'
    };
    return colors[category] || 'secondary';
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
      <h4 className="fw-bold mb-4">Learning Center</h4>

      {featured.length > 0 && (
        <div className="row g-4 mb-4">
          {featured.map((article) => (
            <div key={article.id} className="col-md-6 col-lg-4">
              <div className="article-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/learning/${article.slug}`)}>
                <div className="article-image">
                  <FaGraduationCap />
                </div>
                <div className="p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className={`badge bg-${getCategoryColor(article.category)}`}>
                      {article.category.replace(/_/g, ' ')}
                    </span>
                    <span className="badge bg-warning text-dark"><FaStar /> Featured</span>
                  </div>
                  <h5 className="fw-bold mb-2">{article.title}</h5>
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>{article.summary}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted"><FaClock /> {article.readTime} min read</small>
                    <small className="text-muted"><FaEye /> {article.viewCount} views</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-card mb-4">
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`btn btn-sm ${activeCategory === cat.value ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {filteredArticles.map((article) => (
          <div key={article.id} className="col-md-6 col-lg-4">
            <div className="article-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/learning/${article.slug}`)}>
              <div className="article-image" style={{ background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` }}>
                <FaGraduationCap />
              </div>
              <div className="p-3">
                <span className={`badge bg-${getCategoryColor(article.category)} mb-2`}>
                  {article.category.replace(/_/g, ' ')}
                </span>
                <h5 className="fw-bold mb-2">{article.title}</h5>
                <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>{article.summary}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted"><FaClock /> {article.readTime} min read</small>
                  <small className="text-muted"><FaEye /> {article.viewCount} views</small>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredArticles.length === 0 && (
          <div className="col-12 text-center text-muted py-4">
            No articles found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;