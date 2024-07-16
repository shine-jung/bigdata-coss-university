'use client';

import { useFetchPopupNotice } from 'src/hooks/use-fetch-popup-notice';

import MainLayout from 'src/layouts/main';
import { AuthGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

import PopupNotice from 'src/sections/popup-notice/view';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { user } = useAuthContext();
  const universityCode = user?.university;

  const { popupNotice } = useFetchPopupNotice(universityCode);

  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>

      {popupNotice && (
        <PopupNotice
          title={popupNotice.title}
          imageUrl={popupNotice.imageUrl}
          expiryDate={popupNotice.expiryDate}
        />
      )}
    </AuthGuard>
  );
}
