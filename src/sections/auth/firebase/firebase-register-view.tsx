'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { EMAIL_CONTACT } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function FirebaseRegisterView() {
  const { t } = useTranslate();

  const { register } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('register.nameRequired'))
      .min(2, t('register.nameMinLength'))
      .max(30, t('register.nameMaxLength')),
    email: Yup.string().required(t('register.emailRequired')).email(t('register.emailInvalid')),
    password: Yup.string()
      .required(t('register.passwordRequired'))
      .min(6, t('register.passwordLength')),
    passwordConfirm: Yup.string()
      .required(t('register.passwordConfirmRequired'))
      .oneOf([Yup.ref('password')], t('register.passwordMismatch')),
    role: Yup.string().required(t('register.roleRequired')),
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'user',
    studentNumber: '',
    department: '',
    major: '',
    grade: '',
    semester: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const isStudent = watch('role') === 'user';

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.(data.email, data.password, data.name);
      const searchParams = new URLSearchParams({
        email: data.email,
      }).toString();

      const href = `${paths.auth.firebase.verify}?${searchParams}`;

      router.push(href);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">{t('register.title')}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">{t('register.haveAccount')}</Typography>

        <Link href={paths.auth.firebase.login} component={RouterLink} variant="subtitle2">
          {t('register.login')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderStudentForm = (
    <>
      <RHFTextField name="studentNumber" label={t('register.studentNumber')} />

      <RHFTextField name="department" label={t('register.department')} />

      <RHFTextField name="major" label={t('register.major')} />

      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <RHFTextField name="grade" label={t('register.grade')} type="number" />

        <RHFTextField name="semester" label={t('register.semester')} type="number" />
      </Stack>
    </>
  );

  const renderStaffAlert = (
    <Alert severity="info" sx={{ whiteSpace: 'pre-line' }}>
      {t('register.staffAlert', { email: EMAIL_CONTACT })}
    </Alert>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="name" label={t('register.name')} />
      </Stack>

      <RHFTextField name="email" label={t('register.email')} />

      <RHFTextField
        name="password"
        label={t('register.password')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="passwordConfirm"
        label={t('register.passwordConfirm')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFRadioGroup
        row
        name="role"
        label={t('register.role')}
        options={[
          { label: t('register.student'), value: 'user' },
          { label: t('register.staff'), value: 'staff' },
        ]}
      />

      {isStudent ? renderStudentForm : renderStaffAlert}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('register.register')}
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
