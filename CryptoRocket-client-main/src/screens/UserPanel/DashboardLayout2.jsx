import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import bgImage from '/bg.webp'; 
import Sidebar from '../../components/Screen/UserPanel/Sidebar';
import Header3 from '../../components/Screen/UserPanel/Header3';
import Breadcrumb from '../../components/Screen/UserPanel/BreadCrumb';

const DashboardLayout2 = () => {
    // State to manage the sidebar's visibility on mobile
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            style={{ '--bg-image-url': `url(${bgImage})` }}
            className="bg-rich-black text-hero-primary flex h-screen overflow-hidden main-bg-image"
        >
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div 
                onClick={() => setSidebarOpen(false)}
                className={`fixed inset-0 bg-rich-black/60 z-20 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
            ></div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 sm:px-6">
                    <Header3 onMenuClick={() => setSidebarOpen(true)} />
                    <Breadcrumb />
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout2;