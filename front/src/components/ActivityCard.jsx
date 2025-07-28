const ActivityCard = ({ activity }) => {
    return (
        <div className="activity-card">
            <div className="card-image">
                <img src={activity.image} alt={activity.title} />
            </div>
            <div className="card-content">
                <h3>{activity.title}</h3>
                <p className="description">{activity.description}</p>
                <div className="meta-info">
                    <span className="date">日期: {activity.date}</span>
                    <span className="location">地点: {activity.location}</span>
                    <span className="participants">已报名: {activity.participants}人</span>
                </div>
                <button className="join-button">立即报名</button>
            </div>
        </div>
    )
}

export default ActivityCard