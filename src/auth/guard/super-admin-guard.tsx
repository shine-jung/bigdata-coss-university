'use client';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

type SuperAdminGuardProp = {
  hasContent?: boolean;
  children: React.ReactNode;
};

export default function SuperAdminGuard({ hasContent, children }: SuperAdminGuardProp) {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  // 슈퍼 어드민 권한 확인 (특별한 role)
  const isSuperAdmin = user?.role === 'superadmin' || user?.email === 'happihanjy@naver.com';

  if (!isSuperAdmin) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            슈퍼 어드민 권한이 필요합니다
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            이 페이지에 접근하려면 슈퍼 어드민 권한이 필요합니다.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}
