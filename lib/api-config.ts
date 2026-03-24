export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  MICRO_SERVICES: process.env.NEXT_PUBLIC_MICRO_SERVICES === 'true',
  CAPTCHA_ENABLED: true,
};

export const getLoginUrl = () => {
  return '/api/back/anon/api/login/v2/account';
};

export const createRandomId = function (randomLength = 8) {
  const id = Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString();
  return id;
};

export function getSrc(url: string, prefix?: string) {
  if (API_CONFIG.MICRO_SERVICES) {
    url = prefix ? `${prefix}${url}` : url;
  }
  return `${API_CONFIG.BASE_URL}${url}`;
}

export function getYzmtp(id: string) {
  return getSrc(`/anon/api/captcha/${id}?t=${new Date().getTime().toString()}`, '/sys');
}
