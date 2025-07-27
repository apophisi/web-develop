import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "@/utils/http";
import { toast } from "react-toastify";
import { useState, useRef } from "react";

// 扩展表单验证规则，添加头像字段
const registerSchema = z.object({
    username: z.string().min(3, "用户名至少3个字符"),
    email: z.string().email("请输入有效的邮箱地址"),
    password: z.string().min(6, "密码至少6个字符"),
    confirmPassword: z.string(),
    image_url: z.string().optional() // 头像URL是可选的
}).refine(data => data.password === data.confirmPassword, {
    message: "两次密码输入不一致",
    path: ["confirmPassword"]
});

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    // 头像上传相关状态
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // 处理文件选择
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith("image/")) {
            toast.error("请选择图片文件");
            return;
        }

        // 验证文件大小 (限制2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("图片大小不能超过2MB");
            return;
        }

        setSelectedFile(file);

        // 创建预览
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewUrl(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    // 上传头像到服务器
    const uploadAvatar = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image_url", selectedFile);

            const response = await axios.post("http://localhost:3000/api/oss/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            // 设置表单中的image字段值
            setValue("avatar", response.url);
            console.log(response);
            toast.success("头像上传成功");
            return response.url;
        } catch (error) {
            console.error("头像上传失败:", error);
            toast.error(error.response?.message || "头像上传失败");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    // 表单提交处理
    const onSubmit = async (data) => {
        try {
            // 如果有选择头像但未上传，先上传头像
            if (selectedFile && !data.avatar) {
                const avatarUrl = await uploadAvatar();
                if (!avatarUrl) return; // 上传失败则停止提交
                data.avatar = avatarUrl;
            }

            console.log(data.avatar);
            // 提交注册数据
            await axios.post("http://localhost:3000/api/users/register", {
                username: data.username,
                email: data.email,
                password: data.password,
                avatar: data.avatar || null
            });

            toast.success("注册成功！");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "注册失败");
        }
    };

    return (
        <div className="auth-form">
            <h2>注册新账号</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* 头像上传部分 */}
                <div className="form-group">
                    <label>头像</label>
                    <div className="avatar-upload-container">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />

                        <div className="avatar-preview-container">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="头像预览"
                                    className="avatar-preview"
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    <i className="icon-user"></i>
                                </div>
                            )}
                        </div>

                        <div className="avatar-upload-actions">
                            <button
                                type="button"
                                className="btn-select"
                                onClick={() => fileInputRef.current.click()}
                            >
                                选择头像
                            </button>

                            {selectedFile && !previewUrl.includes("http") && (
                                <button
                                    type="button"
                                    className="btn-upload"
                                    onClick={uploadAvatar}
                                    disabled={isUploading}
                                >
                                    {isUploading ? "上传中..." : "上传头像"}
                                </button>
                            )}
                        </div>
                    </div>
                    <input type="hidden" {...register("avatar")} />
                </div>

                {/* 原有表单字段 */}
                <div className="form-group">
                    <label>用户名</label>
                    <input
                        type="text"
                        {...register("username")}
                        placeholder="请输入用户名"
                    />
                    {errors.username && <span className="error">{errors.username.message}</span>}
                </div>

                <div className="form-group">
                    <label>邮箱</label>
                    <input
                        type="email"
                        {...register("email")}
                        placeholder="请输入邮箱"
                    />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                    <label>密码</label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="请输入密码"
                    />
                    {errors.password && <span className="error">{errors.password.message}</span>}
                </div>

                <div className="form-group">
                    <label>确认密码</label>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="请再次输入密码"
                    />
                    {errors.confirmPassword && (
                        <span className="error">{errors.confirmPassword.message}</span>
                    )}
                </div>

                <button type="submit" className="btn-primary" disabled={isUploading}>
                    {isUploading ? "处理中..." : "注册"}
                </button>

                <div className="form-footer">
                    已有账号？<Link to="/login">立即登录</Link>
                </div>
            </form>
        </div>
    );
}
