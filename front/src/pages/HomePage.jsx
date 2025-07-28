import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import ActivityCard from '../components/ActivityCard'
import '../index.css'

const HomePage = () => {
    const [activities, setActivities] = useState([])
    const [filteredActivities, setFilteredActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // 模拟从API获取数据
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // 这里应该是实际的API调用
                // const response = await fetch('/api/activities');
                // const data = await response.json();

                // 模拟数据
                const mockData = [
                    {
                        id: 1,
                        title: '篮球友谊赛',
                        description: '周末篮球友谊赛，欢迎所有水平玩家参加',
                        date: '2023-06-15',
                        location: '学校体育馆',
                        participants: 12,
                        image: '/images/basketball.jpg'
                    },
                    {
                        id: 2,
                        title: '羽毛球训练营',
                        description: '专业教练指导的羽毛球训练课程',
                        date: '2023-06-20',
                        location: '羽毛球馆',
                        participants: 8,
                        image: '/images/badminton.jpg'
                    },
                    {
                        id: 3,
                        title: '瑜伽放松课',
                        description: '适合初学者的瑜伽课程，帮助放松身心',
                        date: '2023-06-18',
                        location: '健身中心',
                        participants: 15,
                        image: '/images/yoga.jpg'
                    },
                    {
                        id: 4,
                        title: '足球联赛',
                        description: '校内足球联赛，各学院代表队参赛',
                        date: '2023-06-25',
                        location: '足球场',
                        participants: 22,
                        image: '/images/football.jpg'
                    }
                ]

                setActivities(mockData)
                setFilteredActivities(mockData)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching activities:', error)
                setLoading(false)
            }
        }

        fetchActivities()
    }, [])

    // 搜索功能
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredActivities(activities)
        } else {
            const filtered = activities.filter(activity =>
                activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.location.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredActivities(filtered)
        }
    }, [searchTerm, activities])

    const handleSearch = (term) => {
        setSearchTerm(term)
    }

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
                ) : filteredActivities.length === 0 ? (
                    <div className="no-results">没有找到匹配的活动</div>
                ) : (
                    <div className="activities-grid">
                        {filteredActivities.map(activity => (
                            <ActivityCard key={activity.id} activity={activity} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default HomePage