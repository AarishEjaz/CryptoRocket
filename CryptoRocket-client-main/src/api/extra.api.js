import axios from "axios";

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCoinMarkets = async () => {
    try {
        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
        return response.data;
    } catch (error) {
        console.error("Error fetching coin markets:", error);
        throw error;
    }
};

export const fetchCoinChartData = async (coinId, days = 30) => {
    try {
        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching chart data for ${coinId}:`, error);
        throw error;
    }
};