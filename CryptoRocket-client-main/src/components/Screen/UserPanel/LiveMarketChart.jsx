/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchCoinChartData } from '../../../api/extra.api';


const LiveMarketChart = ({ coinId, days = 30 }) => { 
    const [series, setSeries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!coinId) return;

        const loadChartData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchCoinChartData(coinId, days);
                
                const formattedData = data.map(d => ({
                    x: d[0],
                    y: [d[1], d[2], d[3], d[4]]
                }));
                
                setSeries([{ data: formattedData }]);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch chart data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadChartData();
    }, [coinId, days]); 

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            background: 'transparent',
            toolbar: {
                show: true,
                tools: { download: false, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true },
            },
        },
        theme: {
            mode: 'dark',
        },
        xaxis: {
            type: 'datetime',
            labels: { style: { colors: '#94a3b8' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: {
                style: { colors: '#94a3b8' },
                formatter: (value) => `$${Number(value).toLocaleString()}`
            }
        },
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.05)',
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#22c55e',  
                    downward: '#ef4444'  
                },
                wick: {
                    useFillColor: true,
                }
            }
        }
    };
    
    if (isLoading) return <div className="h-[350px] flex items-center justify-center text-slate-400">Loading Chart...</div>;
    if (error) return <div className="h-[350px] flex items-center justify-center text-red-400">Error: {error}</div>;

    return <ReactApexChart options={options} series={series} type="candlestick" height={350} />;
};

export default LiveMarketChart;