import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        window.location.reload(); // 或者 navigate('/login') + 强制更新状态
    };

    const handleLogoutAndNavigate = (path) => {
        logout(); // 清除 token 和状态
        navigate(path); // 跳转页面
    };

    return (
        <nav className="navbar">
            <Link to="/">首页</Link>

            {/* 用按钮或 span 替代 Link，手动跳转 */}
            <span style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleLogoutAndNavigate('/login')}>
        登录
      </span>

            <span style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleLogoutAndNavigate('/register')}>
        注册
      </span>
        </nav>
    );
};

export default Navbar;
