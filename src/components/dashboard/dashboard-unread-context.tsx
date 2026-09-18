'use client';

import { createContext, useContext } from 'react';

export const DashboardUnreadContext = createContext(0);
export function useDashboardUnreadCount() { return useContext(DashboardUnreadContext); }
