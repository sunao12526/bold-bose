'use client';

import React from 'react';
import { Authenticated } from '@refinedev/core';
import { Suspense } from 'react';
import { ThemedLayout } from '@refinedev/antd';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Authenticated key="dashboard" fallback={null}>
        <ThemedLayout>{children}</ThemedLayout>
      </Authenticated>
    </Suspense>
  );
}
