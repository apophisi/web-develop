import { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityTable from '../components/ActivityTable';
import ActivityForm from '../components/ActivityForm';
import '../index.css';

const ActivityManagement = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/activities/getAll');
            setActivities(response.data);
        } catch (error) {
            console.error('获取活动列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddActivity = () => {
        setEditingActivity(null);
        setShowForm(true);
    };

    const handleEditActivity = (activity) => {
        setEditingActivity(activity);
        setShowForm(true);
    };

    const handleDeleteActivity = async (id) => {
        if (window.confirm('确定要删除此活动吗？')) {
            try {
                await axios.delete(`http://localhost:3000/api/activities/delete/${id}`);
                setActivities(activities.filter(activity => activity.id !== id));
            } catch (error) {
                console.error('删除活动失败:', error);
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            console.log(formData);
            if (editingActivity) {
                // 更新活动
                await axios.put(`http://localhost:3000/api/activities/update/${editingActivity.id}`, formData);
            } else {
                // 添加活动
                await axios.post('http://localhost:3000/api/activities/create', formData);
            }
            setShowForm(false);
            fetchActivities();
        } catch (error) {
            console.error('保存活动失败:', error);
        }
    };

    return (
        <div className="activity-management">
            <h2>活动管理</h2>

            <div className="management-actions">
                <button className="add-button" onClick={handleAddActivity}>
                    添加活动
                </button>
            </div>

            {showForm && (
                <ActivityForm
                    activity={editingActivity}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <ActivityTable
                    activities={activities}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                />
            )}
        </div>
    );
};

export default ActivityManagement;