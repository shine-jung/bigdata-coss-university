import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { EMAIL_CONTACT } from 'src/config-global';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const renderStaffAlert = (
    <Alert severity="error" sx={{ whiteSpace: 'pre-line' }}>
      {t('account.staffAlert', { email: EMAIL_CONTACT })}
    </Alert>
  );

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Avatar src={user?.photoURL} alt={user?.name} sx={{ width: 48, height: 48 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>

          <Typography variant="body2" noWrap>
            {t(`university.${user?.university}`)}
          </Typography>

          {user?.role === 'staff' && renderStaffAlert}
        </Stack>

        <Button variant="contained" href={`mailto:${EMAIL_CONTACT}`}>
          {t('account.contact')}
        </Button>
      </Stack>
    </Stack>
  );
}
