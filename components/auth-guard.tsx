'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 检查认证状态是否已加载
    const checkAuth = () => {
      setIsChecking(false);
      // 排除登录页面本身，避免无限重定向
      if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      }
    };

    // 等待 Zustand 持久化数据加载
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state.isAuthenticated !== undefined) {
        checkAuth();
      }
    });

    // 初始检查
    if (isAuthenticated !== undefined) {
      checkAuth();
    }

    return unsubscribe;
  }, [isAuthenticated, pathname, router]);

  // 在检查认证状态时显示加载中或空页面，避免闪现登录页面
  if (isChecking) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
}