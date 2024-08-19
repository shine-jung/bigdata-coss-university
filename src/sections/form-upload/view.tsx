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

import FormCreation from './form';

// ----------------------------------------------------------------------

export default function FormUploadView() {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const handleAddForm = async (
    title: string,
    content: string,
    file: string | null,
    fileName: string | null
  ) => {
    try {
      await axios.post('/api/forms', {
        universityCode: user?.university,
        title,
        content,
        author: user?.name,
        file,
        fileName,
      });

      router.push(paths.main.formDownload);
      enqueueSnackbar(t('form.createFormSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('양식 추가 중 오류가 발생했습니다:', error);
      enqueueSnackbar(t('form.createFormError'), { variant: 'error' });
    }
  };

  return (
    <AdminGuard>
      <Container>
        <Typography variant="h4" mb={5}>
          {t('nav.formUpload')}
        </Typography>

        <FormCreation onAddForm={handleAddForm} />
      </Container>
    </AdminGuard>
  );
}
