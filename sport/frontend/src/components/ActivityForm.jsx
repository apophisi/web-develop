import React, {useState, useEffect, useRef} from 'react';
import axios from "@/utils/http.js";
import {toast} from "react-toastify";

const ActivityForm = ({ activity, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        participants: 0,
        image: ''
    });

    const [previewImage, setPreviewImage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (activity) {
            setFormData({
                title: activity.title,
                description: activity.description,
                date: activity.date.split('T')[0],
                location: activity.location,
                participants: activity.participants,
                image: activity.image
            });
        }
    }, [activity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        if(!file.type.startsWith('image/')) {
            alert('Please upload a image');
            return;
        }

        if(file.size > 5 * 1024 * 1024){
            alert('size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target.result);
        }
        reader.readAsDataURL(file);

        uploadImage(file);
    }

    const uploadImage = async(file) => {
        if(!file) {
            console.log('No file selected');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image_url", file);

            const response = await axios.post("http://localhost:3000/api/oss/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            // 设置表单中的image字段值
            setFormData(prev => ({
                ...prev,
                image: response.url
            }));
            toast.success("头像上传成功");
            return response.url;
        } catch (error) {
            console.error("头像上传失败:", error);
            toast.error(error.response?.message || "头像上传失败");
            return null;
        } finally {
            setIsUploading(false);
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="activity-form-modal">
            <div className="activity-form-content">
                <h2>{activity ? '编辑活动' : '添加新活动'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>活动名称</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>描述</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>日期</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>地点</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>参与人数</label>
                        <input
                            type="number"
                            name="participants"
                            value={formData.participants}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>活动图片</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />

                        <div className="image-upload-container">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="活动预览"
                                    className="image-preview"
                                />
                            ) : (
                                <div className="image-placeholder">
                                    <i className="icon">📷</i>
                                    <span>点击上传图片</span>
                                </div>
                            )}

                            <div className="image-upload-actions">
                                <button
                                    type="button"
                                    className="btn-select"
                                    onClick={triggerFileInput}
                                >
                                    选择图片
                                </button>
                                {isUploading && <span>上传中...</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel}>取消</button>
                        <button type="submit">保存</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivityForm;