import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem('enum') === '1';

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('enum');
        window.location.reload();
    };

    const handleLogoutAndNavigate = (path) => {
        logout();
        navigate(path);
    };

    return (
        <nav className="navbar">
            <Link to="/">首页</Link>

            {isAdmin && (
                <Link to="/admin" className="admin-console-button">
                    控制台
                </Link>
            )}

            <div className="auth-buttons">
                <span
                    className="auth-button"
                    onClick={() => handleLogoutAndNavigate('/login')}
                >
                    登录
                </span>

                <span
                    className="auth-button"
                    onClick={() => handleLogoutAndNavigate('/register')}
                >
                    注册
                </span>
            </div>
        </nav>
    );
};

export default Navbar;