import dynamic from 'next/dynamic';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';
import { useTranslate } from 'src/locales';
import lottieJson from 'src/assets/lotties/school-lottie1.json';

import Logo from 'src/components/logo';

// lottie-web touches `document` at import time whenever a global `navigator` exists, and
// Node.js 21+ defines `navigator` on the server too, so load it on the client only.
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const { t } = useTranslate();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: 15,
        overflow: 'auto',
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || t('title')}
      </Typography>

      <Lottie loop animationData={lottieJson} play style={{ width: 480 }} />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        height: '100vh',
      }}
    >
      {renderLogo}

      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}
