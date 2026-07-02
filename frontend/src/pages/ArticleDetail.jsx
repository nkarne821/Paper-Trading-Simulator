import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { learningAPI } from '../services/api';
import { FaArrowLeft, FaClock, FaEye, FaUser, FaGraduationCap } from 'react-icons/fa';

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await learningAPI.getBySlug(slug);
      setArticle(response.data.data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
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

  if (!article) return null;

  return (
    <div>
      <button className="btn btn-link text-decoration-none mb-3" onClick={() => navigate('/learning')}>
        <FaArrowLeft /> Back to Learning Center
      </button>

      <div className="dashboard-card">
        <div className="article-image mb-4" style={{ height: '250px', borderRadius: '12px' }}>
          <FaGraduationCap size={60} />
        </div>

        <span className="badge bg-primary mb-3">
          {article.category.replace(/_/g, ' ')}
        </span>

        <h2 className="fw-bold mb-3">{article.title}</h2>

        <div className="d-flex align-items-center gap-4 mb-4 text-muted">
          <span><FaUser /> {article.author}</span>
          <span><FaClock /> {article.readTime} min read</span>
          <span><FaEye /> {article.viewCount} views</span>
        </div>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{ lineHeight: '1.8', fontSize: '1.05rem' }}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;