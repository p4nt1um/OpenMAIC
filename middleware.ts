import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export async function middleware(request: NextRequest) {
  // 只拦截 /api/back 开头的请求
  if (request.nextUrl.pathname.startsWith('/api/back')) {
    // 目标地址
    const targetUrl = new URL(
      request.nextUrl.pathname.replace('/api/back', '/back'),
      'https://cloud.oakedu.com.cn',
    );

    targetUrl.search = request.nextUrl.search; // 保留查询参数

    const headers = new Headers(request.headers);

    headers.set('Origin', 'https://cloud.oakedu.com.cn');
    headers.set('Referer', 'https://cloud.oakedu.com.cn/');

    // 如果后端检查 Host，保持目标域名
    headers.set('Host', 'cloud.oakedu.com.cn');

    // 发起代理请求
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    // 创建响应并复制所有响应头
    const nextResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // 如果后端返回了 CORS 相关的错误文本，这里可以统一处理
    if (response.status === 403) {
      // 可以在这里添加日志或修改响应
      console.error('Proxy /api/back got 403', await response.text());
    }

    return nextResponse;
  }

  // 其他请求继续正常处理
  return NextResponse.next();
}

// 配置中间件匹配路径（可选，提高性能）
export const config = {
  matcher: '/api/back/:path*',
};
