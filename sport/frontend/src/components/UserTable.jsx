import React from 'react';

const UserTable = ({ users, onDelete, onSetAdmin }) => {
    return (
        <div className="user-table-container">
            <table className="user-table">
                <thead>
                <tr>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>角色</th>
                    <th>注册日期</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.enum === 1 ? '管理员' : '用户'}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                            <button
                                className={`set-admin-btn ${user.enum === 1 ? 'disabled' : ''}`}
                                onClick={() => user.enum !== 1 && onSetAdmin(user.id)}
                                disabled={user.enum === 1}
                            >
                                {user.enum === 1 ? '已是管理员' : '设为管理员'}
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => onDelete(user.id)}
                            >
                                删除
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;