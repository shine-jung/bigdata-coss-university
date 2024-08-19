import * as Yup from 'yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';

interface EditCourseCompletionNameModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  existingName?: string;
  initialName: string;
}

interface FormValues {
  name: string;
}

export default function EditCourseCompletionNameModal({
  open,
  onClose,
  onSave,
  existingName,
  initialName,
}: EditCourseCompletionNameModalProps) {
  const { t } = useTranslate();

  const FormSchema = Yup.object().shape({
    name: Yup.string().required(t('mileageManagement.courseCompletionNameRequired')),
  });

  const defaultValues = {
    name: existingName || '',
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setFocus,
  } = methods;

  useEffect(() => {
    if (open) {
      reset({ name: existingName || '' });
      // TODO(seokmin): Focus is not working
      setFocus('name');
    }
  }, [open, reset, setFocus, existingName]);

  const onSubmit = handleSubmit(async (data) => {
    const { name } = data;

    if (name) {
      await onSave(name);
      onClose();
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h6">{t('mileageManagement.editCourseCompletionName')}</DialogTitle>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label={t('mileageManagement.courseCompletionName')}
            placeholder={initialName}
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            autoFocus
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('common.save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
