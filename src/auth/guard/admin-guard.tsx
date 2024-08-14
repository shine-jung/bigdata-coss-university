// ----------------------------------------------------------------------

import RoleBasedGuard from './role-based-guard';

type AdminGuardProp = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProp) {
  return (
    <RoleBasedGuard roles={['admin']} hasContent sx={{ pt: 10 }}>
      {children}
    </RoleBasedGuard>
  );
}
