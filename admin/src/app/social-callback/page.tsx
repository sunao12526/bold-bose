'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { message, Card, Spin } from 'antd';
import { axiosInstance } from '../../lib/axios';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('正在处理社交登录...');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setStatus('未获取到授权 Code，跳转回登录页...');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const handleCallback = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        // User is logged in: BINDING
        try {
          setStatus('正在绑定社交账号...');
          await axiosInstance.post('/system/auth/social-bind', {
            type: 'GITHUB',
            code,
          });
          message.success('社交账号绑定成功！');
          router.push('/system/profile');
        } catch (err: any) {
          message.error(err.response?.data?.message || '绑定失败');
          router.push('/system/profile');
        }
      } else {
        // User is not logged in: LOGIN
        try {
          setStatus('正在通过社交账号登录...');
          const response = await axiosInstance.post('/system/auth/social-login', {
            type: 'GITHUB',
            code,
            redirectUri: window.location.origin + '/social-callback',
          });
          const { accessToken } = response.data;
          localStorage.setItem('token', accessToken);
          message.success('登录成功！');
          // Force page reload to sync authProvider state
          window.location.href = '/';
        } catch (err: any) {
          message.error(err.response?.data?.message || '社交登录失败，请尝试常规登录');
          router.push('/login');
        }
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <Card bordered={false} style={{ width: 400, textAlign: 'center', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <Spin size="large" />
      <div style={{ marginTop: 24, fontSize: 16 }}>{status}</div>
    </Card>
  );
}

export default function SocialCallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Suspense fallback={<Spin size="large" />}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
