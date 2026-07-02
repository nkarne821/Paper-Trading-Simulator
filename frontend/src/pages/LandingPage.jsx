import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaShieldAlt,
  FaGraduationCap,
  FaWallet,
  FaArrowRight,
  FaCheckCircle,
  FaUserGraduate,
  FaMobileAlt,
  FaGlobe,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaWallet size={40} />,
      title: "Virtual Money",
      desc: "Start with ₹10,00,000 virtual cash. No real money needed. Practice trading without any financial risk.",
    },
    {
      icon: <FaChartLine size={40} />,
      title: "Real Market Data",
      desc: "Trade with live stock prices from Indian markets. Experience real market conditions with zero risk.",
    },
    {
      icon: <FaGraduationCap size={40} />,
      title: "Learn & Practice",
      desc: "Access learning articles on trading basics, technical analysis, risk management, and portfolio strategy.",
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "100% Risk Free",
      desc: "Make mistakes, learn from them, and improve your trading skills without losing a single rupee.",
    },
  ];

  const howToUse = [
    {
      step: "1",
      title: "Create Account",
      desc: "Sign up for free. No credit card required.",
    },
    {
      step: "2",
      title: "Get Virtual Cash",
      desc: "Receive ₹10,00,000 in your paper trading account.",
    },
    {
      step: "3",
      title: "Explore Stocks",
      desc: "Browse the stock market and analyze real-time prices.",
    },
    {
      step: "4",
      title: "Start Trading",
      desc: "Buy and sell stocks just like in a real trading platform.",
    },
    {
      step: "5",
      title: "Track Performance",
      desc: "Monitor your portfolio, P&L, and learn from your trades.",
    },
    {
      step: "6",
      title: "Learn & Improve",
      desc: "Read articles and refine your trading strategy.",
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold">
                  <FaShieldAlt className="me-2" /> 100% Risk Free Trading
                </div>
                <h1 className="display-3 fw-bold mb-4">
                  Learn Trading
                  <br />
                  <span className="text-gradient">Without Risk</span>
                </h1>
                <p className="lead mb-4 text-white-75">
                  Paper Trading Simulator is a free virtual stock trading
                  platform. Practice buying and selling stocks with ₹10,00,000
                  virtual money. Perfect for beginners who want to learn trading
                  before investing real money.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <button
                    className="btn btn-light btn-lg px-4 fw-bold"
                    onClick={() => navigate("/register")}
                  >
                    Get Started Free <FaArrowRight className="ms-2" />
                  </button>
                  <button
                    className="btn btn-outline-light btn-lg px-4"
                    onClick={() => navigate("/login")}
                  >
                    Already have account? Login
                  </button>
                </div>
                <div className="mt-4 d-flex gap-4 text-white-75">
                  <span>
                    <FaCheckCircle className="me-1" /> No Credit Card
                  </span>
                  <span>
                    <FaCheckCircle className="me-1" /> No Real Money
                  </span>
                  <span>
                    <FaCheckCircle className="me-1" /> Forever Free
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="hero-image">
                <div className="floating-card card-1">
                  <FaChartLine size={24} className="text-success mb-2" />
                  <div className="fw-bold">RELIANCE</div>
                  <div className="text-success">+₹29.40</div>
                </div>
                <div className="floating-card card-2">
                  <FaWallet size={24} className="text-primary mb-2" />
                  <div className="fw-bold">Portfolio</div>
                  <div className="text-primary">₹10,50,000</div>
                </div>
                <div className="floating-card card-3">
                  <FaGraduationCap size={24} className="text-warning mb-2" />
                  <div className="fw-bold">Learning</div>
                  <div className="text-warning">6 Articles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Key Features</h2>
            <p className="text-muted">
              Everything you need to start your trading journey
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="feature-card h-100">
                  <div className="feature-icon">{feature.icon}</div>
                  <h5 className="fw-bold mt-3">{feature.title}</h5>
                  <p className="text-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How to Use</h2>
            <p className="text-muted">Get started in 6 simple steps</p>
          </div>
          <div className="row g-4">
            {howToUse.map((item, index) => (
              <div key={index} className="col-md-4 col-lg-2">
                <div className="step-card text-center h-100">
                  <div className="step-number">{item.step}</div>
                  <h6 className="fw-bold mt-3">{item.title}</h6>
                  <p className="text-muted small">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-5 bg-warning bg-opacity-10">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-start gap-3">
                <FaShieldAlt
                  size={32}
                  className="text-warning flex-shrink-0 mt-1"
                />
                <div>
                  <h4 className="fw-bold">Risk Disclaimer</h4>
                  <p className="mb-0">
                    <strong>
                      This is a simulation platform for educational purposes
                      only.
                    </strong>{" "}
                    All money and transactions on this platform are virtual. No
                    real money is involved. This platform is designed to help
                    you learn trading concepts and practice strategies. Past
                    performance in simulation does not guarantee future results
                    in real trading. Always consult a financial advisor before
                    making real investments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">
            <FaUserGraduate className="me-2" />
            Paper Trading Simulator — Built for Learning |
            <span className="text-warning"> 100% Risk Free</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
