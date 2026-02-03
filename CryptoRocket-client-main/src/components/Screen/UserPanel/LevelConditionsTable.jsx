import React from "react";

const LevelConditionsTable = () => {
    return (
        <div className="space-y-6">
            <div className="bg-blue-900/40 border border-blue-500/50 rounded-lg p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white mb-1">Criteria</h4>
                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                        <li>Self Investment: <span className="text-blue-400 font-bold">$100 Min</span></li>
                        <li>Referral Investment: <span className="text-purple-400 font-bold">$100 Min</span></li>
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Level ROI Dividend Table */}
                <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
                        Level ROI Dividend
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-700 text-xs uppercase text-slate-200">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-md">Levels</th>
                                    <th className="px-4 py-3 rounded-tr-md text-right">ROI %</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">1 - 3</td>
                                    <td className="px-4 py-3 text-right font-bold text-yellow-400">5%</td>
                                </tr>
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">4 - 10</td>
                                    <td className="px-4 py-3 text-right font-bold text-blue-400">2%</td>
                                </tr>
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">11 - 16</td>
                                    <td className="px-4 py-3 text-right font-bold text-orange-400">1%</td>
                                </tr>
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">17 - 25</td>
                                    <td className="px-4 py-3 text-right font-bold text-green-400">0.5%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Level Unlock Conditions Table */}
                <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
                        Level Unlock Conditions
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-700 text-xs uppercase text-slate-200">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-md">Levels</th>
                                    <th className="px-4 py-3 rounded-tr-md text-right">Direct Required</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">Level 1</td>
                                    <td className="px-4 py-3 text-right font-bold text-white">1</td>
                                </tr>
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">Level 2 - 3</td>
                                    <td className="px-4 py-3 text-right font-bold text-white">3</td>
                                </tr>
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">Level 4 - 10</td>
                                    <td className="px-4 py-3 text-right font-bold text-white">6</td>
                                </tr>
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">Level 11 - 16</td>
                                    <td className="px-4 py-3 text-right font-bold text-white">10</td>
                                </tr>
                                <tr className="hover:bg-slate-750 transition-colors">
                                    <td className="px-4 py-3 font-medium">Level 17 - 25</td>
                                    <td className="px-4 py-3 text-right font-bold text-white">15</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelConditionsTable;
