import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 表单验证规则
const loginSchema = z.object({
    username: z.string().min(3, "用户名至少3个字符"),
    password: z.string().min(6, "密码至少6个字符")
});

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/login", data);
            localStorage.setItem("token", response.data.token);
            navigate("/activities"); // 跳转到活动列表页
        } catch (err) {
            setError(err.response?.data?.message || "登录失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>体育活动室登录</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label>用户名</label>
                    <input
                        type="text"
                        {...register("username")}
                        placeholder="请输入用户名"
                    />
                    {errors.username && (
                        <span className="error">{errors.username.message}</span>
                    )}
                </div>

                <div className="form-group">
                    <label>密码</label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="请输入密码"
                    />
                    {errors.password && (
                        <span className="error">{errors.password.message}</span>
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "登录中..." : "登录"}
                </button>

                <div className="links">
                    <a href="/register">注册账号</a>
                    <a href="/forgot-password">忘记密码？</a>
                </div>
            </form>
        </div>
    );
}