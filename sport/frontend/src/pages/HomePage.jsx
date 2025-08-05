import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ActivityCard from '../components/ActivityCard';
import '../index.css';
import axios from "axios";
import { toast } from 'react-toastify';

const HomePage = () => {
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [registeredActivities, setRegisteredActivities] = useState([]);

    const id = localStorage.getItem("id");

    // 从API获取数据
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/activities/getAll');
                setActivities(response.data);
                setFilteredActivities(response.data);

                // 获取当前用户已报名的活动ID列表
                try {
                    const registeredResponse = await axios.post('http://localhost:3000/api/activities/registered-activities', {id});
                    console.log('Registered response:', registeredResponse);

                    // 处理不同类型的响应数据
                    if (registeredResponse.data) {
                        if (Array.isArray(registeredResponse.data)) {
                            setRegisteredActivities(registeredResponse.data.map(act => act.id));
                        } else if (registeredResponse.data.id) {
                            // 单个活动对象
                            setRegisteredActivities([registeredResponse.data.id]);
                        } else {
                            setRegisteredActivities([]);
                        }
                    } else {
                        setRegisteredActivities([]);
                    }
                } catch (regError) {
                    console.error('Error fetching registered activities:', regError);
                    setRegisteredActivities([]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching activities:', error);
                setError('无法加载活动数据，请稍后重试');
                setLoading(false);
            }
        };

        fetchActivities();
    }, [id]);

    // 搜索功能
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredActivities(activities);
        } else {
            const filtered = activities.filter(activity =>
                activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredActivities(filtered);
        }
    }, [searchTerm, activities]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // 检查用户是否已报名该活动
    const isRegistered = (activityId) => {
        return registeredActivities.includes(activityId);
    };

    // 处理报名
    const handleRegister = async (activityId) => {
        try {
            await axios.post(`http://localhost:3000/api/activities/register`, {userId:id, activityId: activityId});

            // 更新本地状态
            setRegisteredActivities([...registeredActivities, activityId]);

            // 更新活动列表中的报名人数
            setActivities(activities.map(activity =>
                activity.id === activityId
                    ? { ...activity, registered_count: activity.registered_count + 1 }
                    : activity
            ));

            toast.success('报名成功');
        } catch (error) {
            console.error('报名失败:', error);
            toast.error(error.response?.data?.message || '报名失败');
        }
    };

    // 处理取消报名
    const handleCancel = async (activityId) => {
        try {
            await axios.post(`http://localhost:3000/api/activities/cancel`,{userId:id, activityId: activityId});

            // 更新本地状态
            setRegisteredActivities(registeredActivities.filter(id => id !== activityId));

            // 更新活动列表中的报名人数
            setActivities(activities.map(activity =>
                activity.id === activityId
                    ? { ...activity, registered_count: activity.registered_count - 1 }
                    : activity
            ));

            toast.success('取消报名成功');
        } catch (error) {
            console.error('取消报名失败:', error);
            toast.error(error.response?.data?.message || '取消报名失败');
        }
    };

    return (
        <div className="home-page">
            <header className="page-header">
                <h1>体育活动室</h1>
                <p>发现并参加你感兴趣的运动活动</p>
            </header>

            <SearchBar onSearch={handleSearch} />

            <section className="activities-section">
                {loading ? (
                    <div className="loading">加载中...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : filteredActivities.length === 0 ? (
                    <div className="no-results">没有找到匹配的活动</div>
                ) : (
                    <div className="activities-grid">
                        {filteredActivities.map(activity => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                onRegister={handleRegister}
                                onCancel={handleCancel}
                                isRegistered={isRegistered(activity.id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;