const CardComponent = ({
  name,
  icon,
  value1,
  value1sum,
  value2,
  value2sum,
  subHead,
  subHead2,
  subHead3,
  value3,
  showButton = false,
}) => {
  return (
    <div className="reusable-box px-6 py-4">
      <p className="text-[var(--text)] text-opacity-50 font-medium text-sm pb-3 flex items-center gap-3">
        {name}
        {showButton && (
          <button className="border border-[var(--border-color)] cursor-pointer bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-text)] py-2 px-4 rounded flex items-center space-x-2 transition-colors duration-200">
            <span className="whitespace-nowrap">Connect Wallet</span>
          </button>
        )}
      </p>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-4">
          {icon && (
            <div className="text-3xl text-blue-600 dark:text-white">{icon}</div>
          )}
          <div>
            <p className="text-[var(--text)] text-opacity-50 text-sm pb-1">
              {subHead || "Total"}
            </p>
            <p className="text-[var(--text)] font-medium">{value1}</p>
            <p className="text-[var(--text)] font-medium text-opacity-70">
              {value1sum}
            </p>
          </div>
        </div>
        <div>
          <p className="text-[var(--text)] text-opacity-50 text-sm pb-1 text-right">
            {subHead2 || "Last 24hr"}
          </p>
          <p className="text-[var(--text)] font-medium">{value2}</p>
          <p className="text-[var(--text)] font-medium text-opacity-70 text-right">
            {value2sum}
          </p>
        </div>
        {subHead3 && (
          <div>
          <p className="text-[var(--text)] text-opacity-50 text-sm pb-1 text-right">
            {subHead3 || "Last 24hr"}
          </p>
          <p className="text-[var(--text)] font-medium">{value3}</p>
          <p className="text-[var(--text)] font-medium text-opacity-70 text-right">
            {value2sum}
          </p>
        </div>
        )}
      </div>
    </div>
  );
};

export default CardComponent;
