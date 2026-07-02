package com.papertrading.service;

import com.papertrading.dto.StockQuoteDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class StockService {

    private static final Map<String, StockData> STOCK_DATA = new HashMap<>();

    static {
        // Nifty 50 stocks with realistic data
        STOCK_DATA.put("RELIANCE", new StockData("Reliance Industries Ltd", new BigDecimal("2450.00"), 1850000000000L, new BigDecimal("22.5")));
        STOCK_DATA.put("TCS", new StockData("Tata Consultancy Services Ltd", new BigDecimal("3850.00"), 1450000000000L, new BigDecimal("28.3")));
        STOCK_DATA.put("HDFCBANK", new StockData("HDFC Bank Ltd", new BigDecimal("1680.00"), 1250000000000L, new BigDecimal("20.1")));
        STOCK_DATA.put("INFY", new StockData("Infosys Ltd", new BigDecimal("1420.00"), 620000000000L, new BigDecimal("24.7")));
        STOCK_DATA.put("ICICIBANK", new StockData("ICICI Bank Ltd", new BigDecimal("1050.00"), 720000000000L, new BigDecimal("18.5")));
        STOCK_DATA.put("HINDUNILVR", new StockData("Hindustan Unilever Ltd", new BigDecimal("2450.00"), 580000000000L, new BigDecimal("32.1")));
        STOCK_DATA.put("SBIN", new StockData("State Bank of India", new BigDecimal("720.00"), 650000000000L, new BigDecimal("9.8")));
        STOCK_DATA.put("BHARTIARTL", new StockData("Bharti Airtel Ltd", new BigDecimal("1150.00"), 650000000000L, new BigDecimal("35.2")));
        STOCK_DATA.put("ITC", new StockData("ITC Ltd", new BigDecimal("420.00"), 520000000000L, new BigDecimal("25.6")));
        STOCK_DATA.put("BAJFINANCE", new StockData("Bajaj Finance Ltd", new BigDecimal("7200.00"), 430000000000L, new BigDecimal("28.9")));
        STOCK_DATA.put("KOTAKBANK", new StockData("Kotak Mahindra Bank Ltd", new BigDecimal("1750.00"), 350000000000L, new BigDecimal("21.3")));
        STOCK_DATA.put("LT", new StockData("Larsen & Toubro Ltd", new BigDecimal("2850.00"), 400000000000L, new BigDecimal("26.4")));
        STOCK_DATA.put("AXISBANK", new StockData("Axis Bank Ltd", new BigDecimal("980.00"), 300000000000L, new BigDecimal("15.7")));
        STOCK_DATA.put("ASIANPAINT", new StockData("Asian Paints Ltd", new BigDecimal("3150.00"), 300000000000L, new BigDecimal("52.1")));
        STOCK_DATA.put("MARUTI", new StockData("Maruti Suzuki India Ltd", new BigDecimal("10800.00"), 330000000000L, new BigDecimal("28.6")));
        STOCK_DATA.put("TITAN", new StockData("Titan Company Ltd", new BigDecimal("3250.00"), 290000000000L, new BigDecimal("78.3")));
        STOCK_DATA.put("WIPRO", new StockData("Wipro Ltd", new BigDecimal("450.00"), 240000000000L, new BigDecimal("19.2")));
        STOCK_DATA.put("ULTRACEMCO", new StockData("UltraTech Cement Ltd", new BigDecimal("8500.00"), 245000000000L, new BigDecimal("38.5")));
        STOCK_DATA.put("NESTLEIND", new StockData("Nestle India Ltd", new BigDecimal("2250.00"), 215000000000L, new BigDecimal("65.8")));
        STOCK_DATA.put("POWERGRID", new StockData("Power Grid Corporation of India Ltd", new BigDecimal("280.00"), 200000000000L, new BigDecimal("14.2")));
    }

    public StockQuoteDto getStockQuote(String symbol) {
        StockData data = STOCK_DATA.get(symbol.toUpperCase());
        if (data == null) {
            return generateRandomQuote(symbol);
        }
        return generateQuoteFromData(symbol.toUpperCase(), data);
    }

    public List<StockQuoteDto> searchStocks(String query) {
        List<StockQuoteDto> results = new ArrayList<>();
        String searchQuery = query.toUpperCase();
        for (Map.Entry<String, StockData> entry : STOCK_DATA.entrySet()) {
            if (entry.getKey().contains(searchQuery) || entry.getValue().name.toUpperCase().contains(searchQuery)) {
                results.add(generateQuoteFromData(entry.getKey(), entry.getValue()));
            }
        }
        return results;
    }

    public List<StockQuoteDto> getMarketOverview() {
        List<StockQuoteDto> overview = new ArrayList<>();
        List<String> topSymbols = Arrays.asList("RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "HINDUNILVR", "SBIN", "BHARTIARTL");
        for (String symbol : topSymbols) {
            overview.add(getStockQuote(symbol));
        }
        return overview;
    }

    public List<StockQuoteDto> getAllStocks() {
        List<StockQuoteDto> stocks = new ArrayList<>();
        for (Map.Entry<String, StockData> entry : STOCK_DATA.entrySet()) {
            stocks.add(generateQuoteFromData(entry.getKey(), entry.getValue()));
        }
        return stocks;
    }

    private StockQuoteDto generateQuoteFromData(String symbol, StockData data) {
        StockQuoteDto quote = new StockQuoteDto();
        quote.setSymbol(symbol);
        quote.setCompanyName(data.name);

        BigDecimal basePrice = data.basePrice;
        BigDecimal variation = basePrice.multiply(new BigDecimal("0.02"));
        BigDecimal randomChange = variation.multiply(new BigDecimal(Math.random() * 2 - 1)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal currentPrice = basePrice.add(randomChange);

        quote.setCurrentPrice(currentPrice);
        quote.setPreviousClose(basePrice);
        quote.setOpen(basePrice.add(randomChange.multiply(new BigDecimal("0.3"))));
        quote.setHigh(currentPrice.add(variation.multiply(new BigDecimal("0.5"))));
        quote.setLow(currentPrice.subtract(variation.multiply(new BigDecimal("0.5"))));
        quote.setChange(currentPrice.subtract(basePrice));
        quote.setChangePercent(quote.getChange().divide(basePrice, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")));
        quote.setVolume((long) (Math.random() * 10000000 + 500000));
        quote.setMarketCap(data.marketCap);
        quote.setPeRatio(data.peRatio);
        quote.setFiftyTwoWeekHigh(basePrice.multiply(new BigDecimal("1.25")));
        quote.setFiftyTwoWeekLow(basePrice.multiply(new BigDecimal("0.75")));
        quote.setCurrency("INR");
        return quote;
    }

    private StockQuoteDto generateRandomQuote(String symbol) {
        StockQuoteDto quote = new StockQuoteDto();
        quote.setSymbol(symbol.toUpperCase());
        quote.setCompanyName(symbol.toUpperCase() + " Ltd");
        BigDecimal basePrice = new BigDecimal(Math.random() * 5000 + 100).setScale(2, RoundingMode.HALF_UP);
        quote.setCurrentPrice(basePrice);
        quote.setPreviousClose(basePrice);
        quote.setOpen(basePrice);
        quote.setHigh(basePrice.multiply(new BigDecimal("1.05")));
        quote.setLow(basePrice.multiply(new BigDecimal("0.95")));
        quote.setChange(BigDecimal.ZERO);
        quote.setChangePercent(BigDecimal.ZERO);
        quote.setVolume((long) (Math.random() * 1000000 + 100000));
        quote.setMarketCap((long) (Math.random() * 100000000000L + 10000000000L));
        quote.setPeRatio(new BigDecimal(Math.random() * 40 + 10).setScale(2, RoundingMode.HALF_UP));
        quote.setFiftyTwoWeekHigh(basePrice.multiply(new BigDecimal("1.3")));
        quote.setFiftyTwoWeekLow(basePrice.multiply(new BigDecimal("0.7")));
        quote.setCurrency("INR");
        return quote;
    }

    private static class StockData {
        String name;
        BigDecimal basePrice;
        Long marketCap;
        BigDecimal peRatio;

        StockData(String name, BigDecimal basePrice, Long marketCap, BigDecimal peRatio) {
            this.name = name;
            this.basePrice = basePrice;
            this.marketCap = marketCap;
            this.peRatio = peRatio;
        }
    }
}