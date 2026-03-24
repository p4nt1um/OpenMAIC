/**
 * 通用密码加密：加密方式RSA2(密码长度2048bit、密码格式：PKCS#1)
 * `https://www.bejson.com/enc/rsa/` 在线RSA验证工具
 * @param {string} password 密码
 */

import JSEncrypt from 'jsencrypt';

export const passwordEncry = (password: string) => {
  // 使用JSEncrypt库进行RSA加密
  const encryptor = new JSEncrypt(); // 新建JSEncrypt对象
  const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArJZoEiTxjtUNJzlRNjJcbp9JiyR9V0r3
MSWuKVaNZNSMYklmymGz4Bmp96ZMV4qnTE1hAyeiZe1fmUYdPmf/ky1ZIksyVfbwq7cRGKXz9Smr
QFkWwsnev1K/VpVLsV/auVTYVuSbDCg08sZSqJWED7cwj5L8Px/j4AZ9ZrfQY0oXd9lp/9cHI0JJ
h+NSZSJvg8DQLpAGVlczCFbmPWx+ijWArrcY4F6y+Mb6QxLljNr4UMqYbfvN9lXDBbRm5EpPKVty
gx5eIJRV5XNlw91bO7v/LDmD9Eo39eoUhNVU732yLvtR3tVkKjECxSGj6jo/rzA+fC0Y//PYppRs
tVe+wwIDAQAB`;
  encryptor.setPublicKey(publicKey); // 设置公钥

  const encryptedPassword = encryptor.encrypt(password);
  return encryptedPassword || password;
};
