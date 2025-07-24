// jwt工具
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import env from '../config/env';

type JwtPayload = string | object | Buffer;

export const signToken = (
    payload: JwtPayload,
    options?: SignOptions
): string => {
    // 明确的类型断言和验证
    const secret: Secret = env.JWT_SECRET as Secret;

    if (!secret || typeof secret !== 'string') {
        throw new Error('JWT_SECRET must be a valid string');
    }

    return jwt.sign(
        payload,
        secret,
        {
            ...options,
            expiresIn: options?.expiresIn || env.JWT_EXPIRES_IN
        } as SignOptions // 明确类型断言
    );
};

export const verifyToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET as Secret) as jwt.JwtPayload;
};