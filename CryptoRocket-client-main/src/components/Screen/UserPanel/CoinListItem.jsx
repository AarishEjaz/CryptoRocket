/* eslint-disable react/prop-types */
const CoinListItem = ({ coin, onSelect }) => {
    const isPositive = coin.price_change_percentage_24h >= 0;

    return (
        <button 
            onClick={() => onSelect(coin)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
            <div className="flex items-center gap-3">
                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                <div>
                    <p className="font-bold text-white text-left">{coin.symbol?.toUpperCase()}</p>
                    <p className="text-xs text-slate-400 text-left">{coin.name}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-white">${coin.current_price?.toLocaleString()}</p>
                <p className={`text-xs font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
            </div>
        </button>
    );
};

export default CoinListItem;