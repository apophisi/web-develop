import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // 添加加载状态
    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                // 验证token是否有效
                const response = await axios.get('http://localhost:3000/api/users/verify', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.valid) {
                    const decoded = jwtDecode(token);
                    console.log(decoded);
                    setUser(decoded);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error(error);
                localStorage.removeItem('token');
                localStorage.removeItem('enum');
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    return { isAuthenticated, isLoading, user };
};

export default useAuth;