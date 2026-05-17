import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar/AdminSidebar';

const AdminLayout = () => {
    return (
        <>
            <style>{`
                .admin-layout {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    margin-left: 260px;
                    background: linear-gradient(120deg, rgba(224, 243, 246, 0.9), rgba(245, 250, 251, 0.98));
                }

                .admin-header {
                    background: linear-gradient(120deg, #f2fbfc 0%, #e5f5f7 55%, #d9eef2 100%);
                    padding: 16px 28px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(148, 163, 184, 0.25);
                    box-shadow: 0 1px 8px rgba(15, 23, 42, 0.05);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    height: 68px;
                }

                .admin-header-left {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .admin-header-title {
                    font-family: "Fraunces", "DM Sans", serif;
                    font-size: 20px;
                    font-weight: 600;
                    color: #184c56;
                    letter-spacing: 0.3px;
                }

                .admin-header-sub {
                    font-family: "Space Grotesk", "DM Sans", sans-serif;
                    font-size: 12px;
                    color: #2a8190;
                    letter-spacing: 0.6px;
                    text-transform: uppercase;
                }

                .admin-header-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #326773;
                    font-weight: 500;
                    font-size: 14px;
                    font-family: "Space Grotesk", "DM Sans", sans-serif;
                }

                .admin-content {
                    flex: 1;
                    background: radial-gradient(circle at top left, rgba(42, 129, 144, 0.12), transparent 35%),
                        radial-gradient(circle at 80% 0%, rgba(42, 129, 144, 0.08), transparent 40%),
                        linear-gradient(180deg, #f7fcfd 0%, #edf8f9 100%);
                    padding: 32px;
                    overflow-y: auto;
                }

                .admin-content-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    animation: contentRise 0.35s ease-out both;
                }

                @keyframes contentRise {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 1024px) {
                    .admin-layout {
                        margin-left: 0;
                    }

                    .admin-sidebar {
                        width: 260px !important;
                    }
                }
            `}</style>

            <AdminSidebar />

            <div className='admin-layout'>
                <div className='admin-header'>
                    <div className='admin-header-left'>
                        <div className='admin-header-title'>Bảng điều khiển</div>
                        <div className='admin-header-sub'>Mộc Sách Admin Center</div>
                    </div>
                </div>
                <div className='admin-content'>
                    <div className='admin-content-inner'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
