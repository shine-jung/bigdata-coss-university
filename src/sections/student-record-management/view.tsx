'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import { UploadAvatar } from 'src/components/upload';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function StudentRecordManagementView() {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateProfile } = useAuthContext();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const ProfileSchema = Yup.object().shape({
    studentNumber: Yup.string(),
    department: Yup.string(),
    major: Yup.string(),
    grade: Yup.string(),
    semester: Yup.string(),
  });

  const defaultValues = {
    studentNumber: user?.studentNumber || '',
    department: user?.department || '',
    major: user?.major || '',
    grade: user?.grade || '',
    semester: user?.semester || '',
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateProfile(data, avatarFile);
      enqueueSnackbar(t('profile.updateSuccess'), { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (newFile) {
      setAvatarFile(newFile);
    }
  };

  const onClickName = () => {
    alert(t('profile.nameAlert'));
  };

  const onClickEmail = () => {
    alert(t('profile.emailAlert'));
  };

  const onClickUniversity = () => {
    alert(t('profile.universityAlert'));
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" mb={5}>
        {t('nav.studentRecordManagement')}
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <UploadAvatar file={avatarFile || user?.photoURL} onDrop={handleDrop} />

          <TextField
            name="name"
            label={t('register.name')}
            value={user?.name}
            inputProps={{ readOnly: true }}
            onClick={onClickName}
          />
          <TextField
            name="email"
            label={t('register.email')}
            value={user?.email}
            inputProps={{ readOnly: true }}
            onClick={onClickEmail}
          />
          <TextField
            name="university"
            label={t('register.university')}
            value={t(`university.${user?.university}`)}
            inputProps={{ readOnly: true }}
            onClick={onClickUniversity}
          />
          <RHFTextField name="studentNumber" label={t('register.studentNumber')} />
          <RHFTextField name="department" label={t('register.department')} />
          <RHFTextField name="major" label={t('register.major')} />
          <RHFTextField name="grade" label={t('register.grade')} />
          <RHFTextField name="semester" label={t('register.semester')} />

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('common.save')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}
