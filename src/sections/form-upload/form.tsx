import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Stack, Alert, Backdrop, CircularProgress } from '@mui/material';

import { useTranslate } from 'src/locales';
import { Form } from 'src/domain/form/form';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFEditor, RHFUpload, RHFTextField } from 'src/components/hook-form';

const FormCreation = ({
  onAddForm,
  form,
  isEditMode,
}: {
  onAddForm: (
    title: string,
    content: string,
    file: string | null,
    fileName: string | null
  ) => Promise<void>;
  form?: Form;
  isEditMode?: boolean;
}) => {
  const { t } = useTranslate();

  const FormSchema = Yup.object().shape({
    title: Yup.string().required(t('form.titleRequired')),
    content: Yup.string().required(t('form.contentRequired')),
    file: isEditMode ? Yup.mixed().notRequired() : Yup.mixed().required(t('form.fileRequired')),
    fileName: isEditMode
      ? Yup.string().notRequired()
      : Yup.string().required(t('form.fileRequired')),
  });

  const defaultValues = {
    title: form?.title || '',
    content: form?.content || '',
    file: null,
    fileName: form?.fileName || null,
  };

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const fileName = watch('fileName');

  const handleDropFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue('file', newFile, { shouldValidate: true });
        setValue('fileName', newFile.name, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleDeleteFile = useCallback(() => {
    setValue('file', null, { shouldValidate: true });
    setValue('fileName', null, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const fileData = data.file as File;
    const file = fileData ? await fileData.arrayBuffer() : null;
    await onAddForm(
      data.title,
      data.content,
      file ? Buffer.from(file).toString('base64') : null,
      data.fileName ?? null
    );
    if (!isEditMode) {
      setValue('title', '');
      setValue('content', '');
      setValue('file', null);
      setValue('fileName', null);
    }
  });

  return (
    <>
      {isSubmitting && (
        <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <RHFTextField name="title" label={t('form.title')} />

          <RHFEditor name="content" />

          {isEditMode && <Alert severity="info">{t('form.editFormAlert')}</Alert>}

          <RHFUpload
            name="file"
            filename={fileName}
            onDrop={handleDropFile}
            onDelete={handleDeleteFile}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t(isEditMode ? 'form.editForm' : 'form.uploadForm')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
};

export default FormCreation;
