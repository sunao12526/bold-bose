'use client';

import { AuthPage } from '@refinedev/antd';

export default function Login() {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: { username: 'admin', password: 'admin123' },
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>芋道云管理系统</span>
        </div>
      }
    />
  );
}
