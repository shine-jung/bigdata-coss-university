'use client';

import axios from 'axios';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { AdminGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';

import NoticeForm from './form';

// ----------------------------------------------------------------------

export default function NoticeCreationView() {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const handleAddNotice = async (title: string, content: string) => {
    try {
      await axios.post('/api/notices', {
        universityCode: user?.university,
        title,
        content,
        author: user?.name,
      });

      router.push(paths.main.notice);
      enqueueSnackbar(t('notice.createNoticeSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('공지사항 추가 중 오류가 발생했습니다:', error);
      enqueueSnackbar(t('notice.createNoticeError'), { variant: 'error' });
    }
  };

  return (
    <AdminGuard>
      <Container>
        <Typography variant="h4" mb={5}>
          {t('nav.noticeCreation')}
        </Typography>

        <NoticeForm onAddNotice={handleAddNotice} />
      </Container>
    </AdminGuard>
  );
}
