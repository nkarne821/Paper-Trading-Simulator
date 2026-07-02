-- Paper Trading Simulator - MySQL Database Schema (Single User, No Roles)
-- Run this script to create the complete database

CREATE DATABASE IF NOT EXISTS paper_trading_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE paper_trading_db;

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- PORTFOLIO & HOLDINGS
-- ============================================

CREATE TABLE IF NOT EXISTS portfolios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    cash_balance DECIMAL(18, 4) DEFAULT 1000000.00,
    total_invested DECIMAL(18, 4) DEFAULT 0.00,
    total_value DECIMAL(18, 4) DEFAULT 1000000.00,
    total_profit_loss DECIMAL(18, 4) DEFAULT 0.00,
    daily_profit_loss DECIMAL(18, 4) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS holdings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    company_name VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    avg_buy_price DECIMAL(18, 4) NOT NULL DEFAULT 0.00,
    current_price DECIMAL(18, 4) DEFAULT 0.00,
    total_invested DECIMAL(18, 4) DEFAULT 0.00,
    current_value DECIMAL(18, 4) DEFAULT 0.00,
    profit_loss DECIMAL(18, 4) DEFAULT 0.00,
    profit_loss_percent DECIMAL(8, 4) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_holding (portfolio_id, symbol)
);

-- ============================================
-- TRANSACTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    portfolio_id BIGINT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    company_name VARCHAR(100),
    transaction_type ENUM('BUY', 'SELL') NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(18, 4) NOT NULL,
    total_amount DECIMAL(18, 4) NOT NULL,
    profit_loss DECIMAL(18, 4) DEFAULT 0.00,
    profit_loss_percent DECIMAL(8, 4) DEFAULT 0.00,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================
-- WATCHLIST
-- ============================================

CREATE TABLE IF NOT EXISTS watchlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(50) DEFAULT 'My Watchlist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watchlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    watchlist_id BIGINT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    company_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (watchlist_id) REFERENCES watchlists(id) ON DELETE CASCADE,
    UNIQUE KEY unique_watchlist_item (watchlist_id, symbol)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('BUY', 'SELL', 'PORTFOLIO', 'MARKET', 'SYSTEM') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- LEARNING ARTICLES
-- ============================================

CREATE TABLE IF NOT EXISTS learning_articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    category ENUM('TRADING_BASICS', 'INVESTING_CONCEPTS', 'RISK_MANAGEMENT', 'MARKET_ANALYSIS', 'PORTFOLIO_STRATEGY') NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100),
    read_time INT DEFAULT 5,
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- SEED DATA - LEARNING ARTICLES ONLY
-- ============================================

INSERT INTO learning_articles (title, slug, category, summary, content, author, read_time, is_featured) VALUES
('Understanding Stock Market Basics', 'understanding-stock-market-basics', 'TRADING_BASICS', 
'Learn the fundamentals of how stock markets work, including exchanges, indices, and trading mechanisms.',
'<h2>What is a Stock Market?</h2><p>A stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. The stock market serves as a platform for companies to raise capital and for investors to grow their wealth.</p><h2>Key Concepts</h2><ul><li><strong>Stock Exchange:</strong> A regulated marketplace like NSE or BSE in India.</li><li><strong>Stock Index:</strong> A measurement of a section of the stock market, like Nifty 50 or Sensex.</li><li><strong>Bull Market:</strong> A market condition where prices are rising.</li><li><strong>Bear Market:</strong> A market condition where prices are falling.</li></ul><h2>How Trading Works</h2><p>When you buy a stock, you purchase a small ownership stake in a company. The price fluctuates based on supply and demand, company performance, and market sentiment.</p>',
'Paper Trading Team', 5, TRUE),

('Introduction to Technical Analysis', 'introduction-to-technical-analysis', 'TRADING_BASICS',
'Discover how to read charts, identify patterns, and use indicators to make informed trading decisions.',
'<h2>What is Technical Analysis?</h2><p>Technical analysis is a method of evaluating securities by analyzing statistics generated by market activity, such as past prices and volume.</p><h2>Key Chart Patterns</h2><ul><li><strong>Head and Shoulders:</strong> A reversal pattern indicating a trend change.</li><li><strong>Double Top/Bottom:</strong> Signals potential trend reversals.</li><li><strong>Triangles:</strong> Continuation patterns showing consolidation.</li></ul><h2>Popular Indicators</h2><p>Moving Averages, RSI, MACD, and Bollinger Bands are essential tools for traders to identify entry and exit points.</p>',
'Paper Trading Team', 7, TRUE),

('Risk Management Strategies', 'risk-management-strategies', 'RISK_MANAGEMENT',
'Essential techniques to protect your capital and minimize losses while maximizing potential gains.',
'<h2>Why Risk Management Matters</h2><p>Successful trading is not just about making profits; it is about preserving capital. Even the best traders experience losses, but proper risk management ensures they survive to trade another day.</p><h2>Core Principles</h2><ul><li><strong>Position Sizing:</strong> Never risk more than 1-2% of your portfolio on a single trade.</li><li><strong>Stop Losses:</strong> Set predetermined exit points to limit losses.</li><li><strong>Diversification:</strong> Spread investments across different sectors.</li><li><strong>Risk-Reward Ratio:</strong> Aim for at least 1:2 ratio.</li></ul><h2>Practical Tips</h2><p>Always use stop-loss orders, avoid emotional trading, and maintain a trading journal to track your decisions and outcomes.</p>',
'Paper Trading Team', 6, TRUE),

('Fundamental Analysis for Beginners', 'fundamental-analysis-for-beginners', 'INVESTING_CONCEPTS',
'Learn how to evaluate companies based on financial statements, ratios, and economic indicators.',
'<h2>What is Fundamental Analysis?</h2><p>Fundamental analysis involves evaluating a company intrinsic value by examining related economic, financial, and other qualitative and quantitative factors.</p><h2>Key Financial Ratios</h2><ul><li><strong>P/E Ratio:</strong> Price-to-Earnings ratio indicates valuation.</li><li><strong>ROE:</strong> Return on Equity measures profitability.</li><li><strong>Debt-to-Equity:</strong> Indicates financial leverage.</li><li><strong>EPS:</strong> Earnings Per Share shows profitability.</li></ul><h2>Reading Financial Statements</h2><p>Understanding balance sheets, income statements, and cash flow statements is crucial for making informed investment decisions.</p>',
'Paper Trading Team', 8, FALSE),

('Building a Diversified Portfolio', 'building-a-diversified-portfolio', 'PORTFOLIO_STRATEGY',
'Strategies for creating a balanced portfolio that aligns with your risk tolerance and financial goals.',
'<h2>The Importance of Diversification</h2><p>Diversification is the practice of spreading investments across various financial instruments, industries, and categories to reduce risk.</p><h2>Asset Allocation Strategies</h2><ul><li><strong>Age-Based Allocation:</strong> Subtract your age from 100 for equity percentage.</li><li><strong>Core-Satellite Strategy:</strong> Combine index funds with individual stocks.</li><li><strong>Sector Rotation:</strong> Shift investments based on economic cycles.</li></ul><h2>Rebalancing</h2><p>Regularly review and rebalance your portfolio to maintain your desired asset allocation and risk level.</p>',
'Paper Trading Team', 6, FALSE),

('Understanding Market Volatility', 'understanding-market-volatility', 'MARKET_ANALYSIS',
'Explore what causes market volatility and how to navigate turbulent market conditions effectively.',
'<h2>What is Volatility?</h2><p>Volatility refers to the degree of variation in trading prices over time. High volatility means large price swings, while low volatility indicates stable prices.</p><h2>Causes of Volatility</h2><ul><li><strong>Economic Data:</strong> GDP, inflation, and employment reports.</li><li><strong>Geopolitical Events:</strong> Wars, elections, and trade disputes.</li><li><strong>Company News:</strong> Earnings reports and product launches.</li><li><strong>Market Sentiment:</strong> Fear and greed drive price movements.</li></ul><h2>Trading in Volatile Markets</h2><p>Use smaller position sizes, wider stop losses, and consider volatility indicators like VIX to gauge market fear levels.</p>',
'Paper Trading Team', 5, FALSE)
ON DUPLICATE KEY UPDATE title = title;
