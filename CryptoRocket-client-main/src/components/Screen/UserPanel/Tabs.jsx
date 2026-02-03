import React from 'react';

const Tabs = ({ tabs, activeTab, onTabClick }) => {
    return (
        <div className="border-b border-slate-700/50">
            <nav className="flex gap-2 sm:gap-6 overflow-x-auto pb-1">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`
                            flex items-center gap-2 px-1 sm:px-3 py-3 font-semibold border-b-2 
                            transition-colors whitespace-nowrap 
                            ${activeTab === tab.id 
                                ? 'border-blue-500 text-white' 
                                : 'border-transparent text-slate-400 hover:text-white'
                            }
                        `}
                    >
                        <i className={`fa-solid ${tab.icon}`}></i>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;