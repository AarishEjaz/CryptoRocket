import React from 'react';
import { useLocation } from 'react-router-dom';
import { MainContent } from '../../../constants/mainContent';

const Breadcrumb = () => {
    const location = useLocation();

    // This function converts a URL path like "/smart-games" into "Smart Games"
    const generateBreadcrumb = () => {
        const pathnames = location.pathname.split('/').filter(x => x); // Splits "/partners" into ["partners"]
        
        if (pathnames.length === 0) {
            return MainContent.appName; // Default text for the main dashboard page
        }

        const currentPage = pathnames[pathnames.length - 1];
        return currentPage
            .replace(/-/g, ' ') // aagr-aisa-naam-hai to aagr aisa naam hai
            .replace(/\b\w/g, l => l.toUpperCase()); // Har word ka pehla letter capital
    };

    return (
        <div className="mb-1">
            <p className="text-slate-400 text-sm">
                Dashboard / <span className="text-slate-200 font-medium">{generateBreadcrumb()}</span>
            </p>
        </div>
    );
};

export default Breadcrumb;