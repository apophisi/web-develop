import { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '../components/UserTable';
import UserSearch from '../components/UserSearch';
import '../index.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/users/get');
            console.log(response);
            setUsers(response.data);
        } catch (error) {
            console.error('获取用户列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term) => {
        console.log(term);
        setSearchTerm(term);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteUser = async (userId) => {
        if (window.confirm('确定要删除此用户吗？')) {
            try {
                await axios.delete(`http://localhost:3000/api/users/delete/${userId}`);
                setUsers(users.filter(user => user.id !== userId));
                window.location.reload();
            } catch (error) {
                console.error('删除用户失败:', error);
            }
        }
    };

    const handleSetAdmin = async(userId) => {
        if(window.confirm('确定要将此用户设为管理员吗')){
            try {
                await axios.post(`http://localhost:3000/api/users/set-admin/${userId}`);
                setUsers(users.filter(user => user.id !== userId));
                window.location.reload();
            }catch(error) {
                console.error('设置管理员失败:',error);
            }
        }
    }

    return (
        <div className="user-management">
            <h2>用户管理</h2>

            <div className="management-actions">
                <UserSearch onSearch={handleSearch} />
                {/*<button className="add-button">添加用户</button>*/}
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <UserTable
                    users={filteredUsers}
                    onDelete={handleDeleteUser}
                    onSetAdmin={handleSetAdmin}
                />
            )}
        </div>
    );
};

export default UserManagement;