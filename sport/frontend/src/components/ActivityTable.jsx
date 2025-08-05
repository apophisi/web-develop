import React from 'react';

const ActivityTable = ({ activities, onEdit, onDelete }) => {
    return (
        <div className="activity-table-container">
            <table className="activity-table">
                <thead>
                <tr>
                    <th>活动名称</th>
                    <th>描述</th>
                    <th>日期</th>
                    <th>地点</th>
                    <th>参与人数</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {activities.map((activity) => (
                    <tr key={activity.id}>
                        <td>{activity.title}</td>
                        <td>{activity.description}</td>
                        <td>{new Date(activity.date).toLocaleDateString()}</td>
                        <td>{activity.location}</td>
                        <td>{activity.participants}</td>
                        <td className="actions">
                            <button
                                className="edit-btn"
                                onClick={() => onEdit(activity)}
                            >
                                编辑
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => onDelete(activity.id)}
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

export default ActivityTable;