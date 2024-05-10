import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { EMAIL_CONTACT } from 'src/config-global';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useAuthContext();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 48, height: 48 }}>
          {user?.displayName?.charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

        <Button variant="contained" href={`mailto:${EMAIL_CONTACT}`}>
          문의하기
        </Button>
      </Stack>
    </Stack>
  );
}
