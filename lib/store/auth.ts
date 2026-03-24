import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLoginUrl, API_CONFIG } from '@/lib/api-config';
import { passwordEncry } from '@/lib/utils/crypto';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    username: string;
  } | null;
  login: (
    username: string,
    password: string,
    captcha?: string,
    captchaId?: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (username: string, password: string, captcha?: string, captchaId?: string) => {
        try {
          // 密码加密
          const encryptedPassword = passwordEncry(password);
          // 构建请求参数
          const requestBody: any = {
            dlFs: '1',
            zh: username,
            mm: encryptedPassword,
          };
          // 如果启用了验证码，添加验证码参数
          if (captcha && captchaId) {
            requestBody.captcha = captcha;
            requestBody.captchaKey = captchaId;
          }
          // 调用真实的后台接口进行登录验证
          const response = await fetch(getLoginUrl(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
          const result = await response.json();
          if (result.code === 1) {
            set({
              isAuthenticated: true,
              user: {
                id: result.data?.ryId || '1',
                username: result.data?.xm || username,
                email: '',
              },
            });
            return { success: true };
          } else {
            return { success: false, message: result.msg || result.message || '登录失败' };
          }
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, message: '网络错误，请检查连接' };
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
