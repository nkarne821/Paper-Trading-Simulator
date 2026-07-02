# Paper Trading Simulator

A simple full-stack paper trading application for single-user deployment.

## Technology Stack

- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JDBC, MySQL
- **Frontend:** React 18, Vite, Bootstrap 5, Chart.js

## Quick Start (Local Development)

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

## Deployment Guide

### Option 1: Deploy Backend + Frontend Together (Recommended)

Build the frontend and serve it from the backend:

```bash
# 1. Build frontend
cd frontend
npm install
npm run build

# 2. Copy built files to backend static resources
mkdir -p backend/src/main/resources/static
cp -r frontend/dist/* backend/src/main/resources/static/

# 3. Build and run backend
cd backend
mvn clean package
java -jar target/paper-trading-backend-1.0.0.jar
```

The app will be available at `http://localhost:8080`

### Option 2: Separate Deployment

- Deploy backend to any Java hosting (AWS, Heroku, Railway, etc.)
- Deploy frontend to any static hosting (Vercel, Netlify, GitHub Pages)
- Update `VITE_API_URL` in frontend to point to your backend

### Option 3: Using Docker (Simplest)

Create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: paper_trading_db
    ports:
      - "3306:3306"

  app:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/paper_trading_db
```

## Default User

Register any account. Each user gets:
- Virtual Balance: ₹10,00,000
- Default Watchlist

## Configuration

Edit `backend/src/main/resources/application.properties`:
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/paper_trading_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Secret (change for production)
jwt.secret=your-secret-key-here
```

## Features

- User Registration/Login with JWT
- Buy/Sell stocks with virtual money
- Portfolio tracking with charts
- Watchlist
- Transaction history
- Market overview
- Learning center
- Notifications
