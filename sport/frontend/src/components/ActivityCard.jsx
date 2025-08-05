import { Link, useNavigate } from 'react-router-dom';

const ActivityCard = ({ activity, onRegister, onCancel, isRegistered }) => {
    // 检查活动是否已过期
    const isExpired = new Date(activity.date) < new Date();

    // 计算剩余名额
    const remainingSpots = activity.participants - activity.registered_count;

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/activities/${activity.id}`);
    };

    const handleButtonClick = (e, action) => {
        e.stopPropagation(); // 阻止事件冒泡
        action(activity.id);
    };


    return (
        <div className="activity-card" onClick={handleCardClick}>
            <div className="card-image">
                <img src={activity.image} alt={activity.title} />
                {/* 状态标签 */}
                {isExpired && <div className="status-tag expired">已过期</div>}
                {!isExpired && isRegistered && <div className="status-tag registered">已报名</div>}
                {!isExpired && remainingSpots <= 0 && <div className="status-tag full">已报满</div>}
            </div>
            <div className="card-content">
                <h3>{activity.title}</h3>
                <p className="description">{activity.description}</p>
                <div className="meta-info">
                        <span className="date">
                            日期: {new Date(activity.date).toLocaleString()}
                            {isExpired && <span className="expired-text"> (已过期)</span>}
                        </span>
                    <span className="location">地点: {activity.location}</span>
                    <div className="registration-info">
                        <span>已报名: {activity.registered_count}/{activity.participants}人</span>
                        {!isExpired && remainingSpots > 0 && (
                            <span className="remaining">剩余: {remainingSpots}个名额</span>
                        )}
                    </div>
                </div>

                {/* 根据状态显示不同按钮 */}
                {isExpired ? (
                    <button
                        className="join-button disabled"
                        disabled
                        onClick={(e) => e.stopPropagation()}
                    >
                        活动已过期
                    </button>
                ) : isRegistered ? (
                    <button
                        className="cancel-button"
                        onClick={(e) => handleButtonClick(e, onCancel)}
                    >
                        取消报名
                    </button>
                ) : remainingSpots > 0 ? (
                    <button
                        className="join-button"
                        onClick={(e) => handleButtonClick(e, onRegister)}
                    >
                        立即报名
                    </button>
                ) : (
                    <button
                        className="join-button disabled"
                        disabled
                        onClick={(e) => e.stopPropagation()}
                    >
                        已报满
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActivityCard;