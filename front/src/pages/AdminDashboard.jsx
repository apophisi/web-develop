import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSideBar.jsx';
import '../index.css';

const AdminDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className={`admin-dashboard ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <AdminSidebar
                collapsed={sidebarCollapsed}
                toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>管理员控制台</h1>
                </div>
                <div className="admin-main">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;