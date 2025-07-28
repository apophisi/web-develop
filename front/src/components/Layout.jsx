import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    console.log('Layout渲染')

    return (
        <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="main-content" style={{ flex: 1 }}>
                <Outlet context={{ test: '数据' }} />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;