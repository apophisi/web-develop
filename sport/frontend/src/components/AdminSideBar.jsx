import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ collapsed, toggleCollapse }) => {
    return (
        <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && <h2>管理面板</h2>}
                <button className="collapse-btn" onClick={toggleCollapse}>
                    {collapsed ? '>' : '<'}
                </button>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/activities"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    title="返回首页"
                >
                    <i className="icon">🏠</i>
                    {!collapsed && <span>返回首页</span>}
                    {collapsed && <span className="tooltip">返回首页</span>}
                </NavLink>

                <NavLink
                    to="users"
                    className={({ isActive }) => isActive ? 'active' : ''}
                >
                    <i className="icon">👥</i>
                    {!collapsed && <span>用户管理</span>}
                </NavLink>

                <NavLink
                    to="activities"
                    className={({ isActive }) => isActive ? 'active' : ''}
                >
                    <i className="icon">🎯</i>
                    {!collapsed && <span>活动管理</span>}
                </NavLink>
            </nav>
        </div>
    );
};

export default AdminSidebar;