import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "@/utils/http"; // 使用封装后的axios
import { toast } from "react-toastify";

// 表单验证规则
const registerSchema = z.object({
    username: z.string().min(3, "用户名至少3个字符"),
    email: z.string().email("请输入有效的邮箱地址"),
    password: z.string().min(6, "密码至少6个字符"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "两次密码输入不一致",
    path: ["confirmPassword"]
});

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        try {
            await axios.post("/auth/register", {
                username: data.username,
                email: data.email,
                password: data.password
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

                <button type="submit" className="btn-primary">
                    注册
                </button>

                <div className="form-footer">
                    已有账号？<Link to="/login">立即登录</Link>
                </div>
            </form>
        </div>
    );
}