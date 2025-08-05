import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/UseAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ActivityManagement from "./pages/ActivityManagement.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import ActivityDetail from "./pages/ActivityDetail";

function App() {
    const { isAuthenticated, isLoading,user } = useAuth(); // 添加加载状态

    if (isLoading) {
        return <div>Loading...</div>; // 添加加载状态处理
    }

    return (
        <Router>
            <Routes>
                {/* 根路径根据认证状态重定向 */}
                <Route path="/" element={
                    isAuthenticated ?
                        <Navigate to="/activities" replace /> :
                        <Navigate to="/login" replace />
                } />

                {/* 公开路由 */}
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/activities" replace /> : <LoginPage />
                } />
                <Route path="/register" element={
                    isAuthenticated ? <Navigate to="/activities" replace /> : <RegisterPage />
                } />

                {/* 受保护路由 */}
                <Route element={<Layout />}>
                    <Route path="/activities" element={
                        isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
                    } />
                </Route>

                <Route element={<Layout />}>
                    <Route path="/activities/:id" element={
                        isAuthenticated ? <ActivityDetail /> : <Navigate to="/login" replace />
                    } />
                </Route>

                <Route path="/admin" element={
                    isAuthenticated && user?.enum === 1 ?
                        <AdminDashboard /> :
                        <Navigate to={isAuthenticated ? "/unauthorized" : "/login"} replace />
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={
                        <div className="admin-home">
                            <h1>管理员仪表盘</h1>
                            <p>欢迎回来，管理员</p>
                        </div>
                    } />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="activities" element={<ActivityManagement />} />
                </Route>

                {/* 404页面 */}
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;