import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Theme, SxProps } from '@mui/material/styles';

import { useTranslate } from 'src/locales';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles?: string[];
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function RoleBasedGuard({ hasContent, roles, children, sx }: RoleBasedGuardProp) {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const currentRole = user?.role || 'user';

  if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {t('permission.denied')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {t('permission.deniedDescription')}
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

  return <> {children} </>;
}
