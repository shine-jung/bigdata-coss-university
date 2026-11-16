'use client';

import { SuperAdminGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <SuperAdminGuard hasContent>{children}</SuperAdminGuard>;
}

