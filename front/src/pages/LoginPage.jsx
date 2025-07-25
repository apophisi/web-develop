import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 表单验证规则 - 修改为使用email字段
const loginSchema = z.object({
    email: z.string().email("请输入有效邮箱").min(3, "邮箱至少3个字符"),
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
            console.log(data)
            const response = await axios.post("http://localhost:3000/api/users/login", {
                email: data.email,
                password: data.password
            });
            localStorage.setItem("token", response.data.token);
            navigate("/activities");
        } catch (err) {
            setError(err.response?.data?.message || "登录失败");
            console.log(err)
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
                    <label>邮箱</label>
                    <input
                        type="email"  // 改为email类型
                        {...register("email")}
                        placeholder="请输入邮箱"
                    />
                    {errors.email && (  // 改为errors.email
                        <span className="error">{errors.email.message}</span>
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