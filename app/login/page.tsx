'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createRandomId, getYzmtp, API_CONFIG } from '@/lib/api-config';
import Script from 'next/script';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const id = createRandomId();
    setCaptchaId(id);
    setCaptchaUrl(getYzmtp(id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(username, password, API_CONFIG.CAPTCHA_ENABLED ? captcha : undefined, API_CONFIG.CAPTCHA_ENABLED ? captchaId : undefined);
      if (result.success) {
        toast.success('登录成功！');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toast.error(result.message || '登录失败');
        if (API_CONFIG.CAPTCHA_ENABLED) {
          refreshCaptcha();
          setCaptcha('');
        }
      }
    } catch (err) {
      toast.error('发生错误，请重试');
      if (API_CONFIG.CAPTCHA_ENABLED) {
        refreshCaptcha();
        setCaptcha('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8">
          {/* 左侧插图 */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome</h1>
                <p className="text-xl text-white/90 mb-8">欢迎登录uCare智能体平台</p>
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-400 rounded-full opacity-50"></div>
                  <div className="absolute top-1/2 -right-4 w-16 h-16 bg-blue-400 rounded-full opacity-50"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧登录表单 */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">欢迎登录</h2>
                <p className="text-gray-600">uCare智能体平台</p>
              </div>



              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">账号</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入账号"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    required
                  />
                </div>

                {API_CONFIG.CAPTCHA_ENABLED && (
                  <div className="space-y-2">
                    <Label htmlFor="captcha">验证码</Label>
                    <div className="flex gap-2">
                      <Input
                        id="captcha"
                        type="text"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        placeholder="请输入验证码"
                        required
                      />
                      <div className="w-32 h-10 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer overflow-hidden" onClick={refreshCaptcha}>
                        {captchaUrl ? (
                          <img src={captchaUrl} alt="验证码" className="w-full h-full" />
                        ) : (
                          <span className="text-gray-600 font-mono">加载中...</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      同意并遵守平台的用户协议和个人信息保护政策
                    </Label>
                  </div>
                </div> */}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={() => {
                      setUsername('');
                      setPassword('');
                      setCaptcha('');
                    }}
                  >
                    重置
                  </Button>
                </div>

                {/* <div className="flex justify-between text-sm">
                  <a href="#" className="text-blue-600 hover:underline">
                    忘记密码？
                  </a>
                  <a href="#" className="text-blue-600 hover:underline">
                    验证码登录
                  </a>
                </div> */}
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>上海长江唯诚科技股份有限公司</p>
                <p className="mt-1">公网安备案号沪ICP备15050433号</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}