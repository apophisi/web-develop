import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../index.css'

const ActivityDetail = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [comments, setComments] = useState([]);

    const userId = localStorage.getItem('id');

    // 获取活动详情和报名状态
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const [activityRes, commentsRes, registrationRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/activities/get/${id}`),
                    axios.get(`http://localhost:3000/api/comments?activityId=${id}`),
                    axios.get(`http://localhost:3000/api/activities/check-registration`, {
                        params: { userId, activityId: id }
                    })
                ]);

                // 标准化评论数据结构
                const normalizeComment = (comment) => {
                    // 确保有user对象
                    const user = comment.user || {
                        id: comment['user.id'] || comment.user_id,
                        username: comment['user.username'] || '匿名用户',
                        image_url: comment['user.image_url'] || '/default-avatar.png'
                    };

                    return {
                        ...comment,
                        user,
                        createdAt: comment.created_at || comment.createdAt,
                        // 递归处理回复
                        replies: (comment.replies || []).map(normalizeComment)
                    };
                };

                const normalizedComments = commentsRes.data.map(normalizeComment);

                setActivity(activityRes.data);
                setComments(normalizedComments);
                setIsRegistered(registrationRes.data);
                setLoading(false);
            } catch (err) {
                console.error('加载数据失败:', err);
                setError('加载数据失败，请刷新重试');
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id, userId]);

    // 报名活动 (与ActivityCard保持一致)
    const handleRegister = async (e) => {
        e?.stopPropagation(); // 兼容可能的事件对象

        try {
            await axios.post(`http://localhost:3000/api/activities/register`, {
                userId,
                activityId: id
            });

            setIsRegistered(true);
            setActivity(prev => ({
                ...prev,
                registered_count: prev.registered_count + 1
            }));

            // 更新本地缓存
            localStorage.setItem(`registered_${id}`, 'true');
        } catch (err) {
            console.error('报名失败:', err);
        }
    };

    // 取消报名 (与ActivityCard保持一致)
    const handleCancel = async (e) => {
        e?.stopPropagation(); // 兼容可能的事件对象

        try {
            await axios.post(`http://localhost:3000/api/activities/cancel`, {
                userId,
                activityId: id
            });

            setIsRegistered(false);
            setActivity(prev => ({
                ...prev,
                registered_count: prev.registered_count - 1
            }));

            // 更新本地缓存
            localStorage.removeItem(`registered_${id}`);
        } catch (err) {
            console.error('取消报名失败:', err);
        }
    };

    // 提交评论
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const res = await axios.post('http://localhost:3000/api/comments/create', {
                userId,
                activityId: id,
                content: commentText
            });

            setComments([res.data, ...comments]);
            setCommentText('');
        } catch (err) {
            console.error('评论提交失败:', err);
        }

        window.location.reload();
    };

    // 提交回复
    const handleReplySubmit = async (commentId) => {
        if (!replyText.trim()) return;

        try {
            const res = await axios.post('http://localhost:3000/api/comments/reply', {
                userId,
                commentId,
                content: replyText
            });

            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), res.data]
                    };
                }
                return comment;
            }));

            setReplyText('');
            setReplyingTo(null);

            window.location.reload();
        } catch (err) {
            console.error('回复提交失败:', err);
        }
    };

    if (loading) return <div className="loading">加载中...</div>;
    if (error) return <div className="error">错误: {error}</div>;
    if (!activity) return <div className="not-found">活动不存在</div>;

    const isExpired = new Date(activity.date) < new Date();
    const remainingSpots = activity.participants - activity.registered_count;


    return (
        <div className="activity-detail-container">
            {/* 活动详情部分 */}
            <div className="activity-detail-card">
                {/* 活动头部信息 */}
                <div className="activity-header">
                    <h1>{activity.title}</h1>
                    <div className="activity-meta">
                        <span>日期: {new Date(activity.date).toLocaleString()}</span>
                        <span>地点: {activity.location}</span>
                        <span>已报名: {activity.registered_count}/{activity.participants}人</span>
                        {!isExpired && remainingSpots > 0 && (
                            <span className="remaining">剩余: {remainingSpots}个名额</span>
                        )}
                    </div>
                </div>

                {/* 活动图片 */}
                <div className="activity-image">
                    <img src={activity.image} alt={activity.title} />
                    {isExpired && <div className="status-tag expired">已过期</div>}
                    {!isExpired && isRegistered && <div className="status-tag registered">已报名</div>}
                    {!isExpired && remainingSpots <= 0 && <div className="status-tag full">已报满</div>}
                </div>

                {/* 活动描述 */}
                <div className="activity-description">
                    <h3>活动详情</h3>
                    <p>{activity.description}</p>
                </div>

                {/* 报名按钮区域 - 与ActivityCard保持一致 */}
                <div className="activity-actions">
                    {isExpired ? (
                        <button className="join-button disabled" disabled>
                            活动已过期
                        </button>
                    ) : isRegistered ? (
                        <button className="cancel-button" onClick={handleCancel}>
                            取消报名
                        </button>
                    ) : remainingSpots > 0 ? (
                        <button className="join-button" onClick={handleRegister}>
                            立即报名
                        </button>
                    ) : (
                        <button className="join-button disabled" disabled>
                            已报满
                        </button>
                    )}
                </div>
            </div>

            {/* 评论区域 */}
            <div className="comments-section">
                <h2>评论 ({comments.length})</h2>

                {/* 评论表单 */}
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="写下你的评论..."
                        rows="3"
                    />
                    <button type="submit" className="submit-comment">
                        发表评论
                    </button>
                </form>

                {/* 评论列表 */}
                <div className="comments-list">
                    {comments.map(comment => {
                        // 确保comment和user对象存在
                        const user = comment.user || {};
                        return (
                            <div key={comment.id || Math.random()} className="comment-item">
                                <div className="comment-header">
                                    <img
                                        src={user.image_url || '/default-avatar.png'}
                                        alt={user.username || '匿名用户'}
                                        className="comment-avatar"
                                    />
                                    <div className="comment-user">
                                        <strong>{user.username || '匿名用户'}</strong>
                                        <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</span>
                                    </div>
                                </div>
                                <div className="comment-content">
                                    {comment.content || '无内容'}
                                </div>

                                {/* 回复按钮 */}
                                <button
                                    className="reply-button"
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                >
                                    回复
                                </button>

                                {/* 回复表单 */}
                                {replyingTo === comment.id && (
                                    <div className="reply-form">
                                         <textarea
                                             value={replyText}
                                             onChange={(e) => setReplyText(e.target.value)}
                                             placeholder={`回复${user.username || '用户'}...`}
                                             rows="2"
                                         />
                                        <div className="reply-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleReplySubmit(comment.id)}
                                            >
                                                提交回复
                                            </button>
                                            <button
                                                type="button"
                                                className="cancel-reply"
                                                onClick={() => {
                                                    setReplyText('');
                                                    setReplyingTo(null);
                                                }}
                                            >
                                                取消
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* 回复列表 - 添加安全访问 */}
                                {comment.replies?.length > 0 && (
                                    <div className="replies-list">
                                        {comment.replies.map(reply => {
                                            const replyUser = reply.user || {};
                                            return (
                                                <div key={reply.id || Math.random()} className="reply-item">
                                                    <div className="reply-header">
                                                        <img
                                                            src={replyUser.image_url || '/default-avatar.png'}
                                                            alt={replyUser.username || '匿名用户'}
                                                            className="reply-avatar"
                                                        />
                                                        <div className="reply-user">
                                                            <strong>{replyUser.username || '匿名用户'}</strong>
                                                            <span>回复 {user.username || '用户'}</span>
                                                            <span>{reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ''}</span>
                                                        </div>
                                                    </div>
                                                    <div className="reply-content">
                                                        {reply.content || '无内容'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {comments.length === 0 && (
                        <div className="no-comments">暂无评论，快来发表第一条评论吧！</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;