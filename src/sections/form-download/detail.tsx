import axios from 'axios';
import { useState } from 'react';

import { Box, Stack, alpha, Button, Typography } from '@mui/material';

import { fTimestampToDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { Form } from 'src/domain/form/form';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import Markdown from 'src/components/markdown/markdown';

import FormCreation from '../form-upload/form';

const FormDetail = ({
  form,
  onBack,
  refetchForms,
}: {
  form: Form;
  onBack: () => void;
  refetchForms: () => void;
}) => {
  const { t } = useTranslate();
  const { user, isAdmin } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditForm = async (
    title: string,
    content: string,
    file: string | null,
    fileName: string | null
  ) => {
    try {
      await axios.put(`/api/forms`, {
        id: form.id,
        universityCode: user?.university,
        title,
        content,
        author: user?.displayName,
        ...(file && { file, fileName }),
      });
      refetchForms();
      setIsEditMode(false);
      onBack();
      enqueueSnackbar(t('form.editFormSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('양식 수정 중 오류가 발생했습니다:', error);
      enqueueSnackbar(t('form.editFormError'), { variant: 'error' });
    }
  };

  const handleDeleteForm = async () => {
    if (!window.confirm(t('form.deleteFormPrompt'))) {
      return;
    }

    try {
      await axios.delete(`/api/forms`, {
        params: { id: form.id, universityCode: user?.university },
      });
      refetchForms();
      onBack();
      enqueueSnackbar(t('form.deleteFormSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('양식 삭제 중 오류가 발생했습니다:', error);
      enqueueSnackbar(t('form.deleteFormError'), { variant: 'error' });
    }
  };

  const handleDownloadForm = async () => {
    try {
      const link = document.createElement('a');
      link.href = form.downloadURL;
      link.download = form.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      enqueueSnackbar(t('form.downloadFormSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('양식 다운로드 중 오류가 발생했습니다:', error);
      enqueueSnackbar(t('form.downloadFormError'), { variant: 'error' });
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        border: (theme) => `dashed 1px ${theme.palette.divider}`,
        p: 3,
      }}
    >
      {isEditMode ? (
        <FormCreation onAddForm={handleEditForm} form={form} isEditMode />
      ) : (
        <>
          <Typography variant="h4">{form.title}</Typography>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="subtitle1" color="textSecondary">
              {t('form.author')}: {form.author}
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              {t('form.createdAt')} : {fTimestampToDateTime(form.createdAt)}
            </Typography>
          </Box>

          <Markdown children={form.content} />

          <Button
            variant="contained"
            onClick={handleDownloadForm}
            startIcon={<Iconify icon="eva:download-fill" />}
            size="large"
            color="primary"
            sx={{ mt: 2 }}
          >
            {t('form.downloadForm')} - {form.fileName}
          </Button>
        </>
      )}

      <Stack direction="row" spacing={2} mt={5}>
        <Button variant="contained" onClick={onBack}>
          {t('common.back')}
        </Button>

        {isAdmin && !isEditMode && (
          <>
            <Button variant="contained" color="info" onClick={() => setIsEditMode(true)}>
              {t('form.editForm')}
            </Button>

            <Button variant="contained" color="error" onClick={handleDeleteForm}>
              {t('form.deleteForm')}
            </Button>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default FormDetail;
