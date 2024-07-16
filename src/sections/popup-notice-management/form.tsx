import axios from 'axios';
import * as Yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFUploadImage } from 'src/components/hook-form';

interface PopupNoticeFormProps {
  universityCode: string;
  refetch: () => void;
}

const PopupNoticeForm = ({ universityCode, refetch }: PopupNoticeFormProps) => {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const FormSchema = Yup.object().shape({
    title: Yup.string().required(t('popupNotice.titleRequired')),
    image: Yup.mixed().required(t('popupNotice.imageRequired')).nullable(),
    expiryDate: Yup.date().required(t('popupNotice.expiryDateRequired')).nullable(),
  });

  const defaultValues = {
    title: '',
    image: null,
    expiryDate: null,
  };

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { title, image, expiryDate } = data;

    try {
      const file = image as File;
      const imageData = await file.arrayBuffer();
      const base64Image = Buffer.from(imageData).toString('base64');

      await axios.post('/api/popup-notice', {
        universityCode,
        title,
        image: base64Image,
        expiryDate,
      });

      enqueueSnackbar(t('popupNotice.createPopupNoticeSuccess'), { variant: 'success' });
      refetch();
      methods.reset(defaultValues);
    } catch (error) {
      console.error('팝업 공지 추가 중 오류가 발생했습니다:', error);
      enqueueSnackbar(t('popupNotice.createPopupNoticeError'), { variant: 'error' });
    }
  });

  const handleDropImage = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleDeleteImage = useCallback(() => {
    setValue('image', null, { shouldValidate: true });
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <RHFTextField name="title" label={t('popupNotice.title')} />

        <RHFUploadImage name="image" onDrop={handleDropImage} onDelete={handleDeleteImage} />

        <Controller
          name="expiryDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              {...field}
              label={t('popupNotice.expiryDate')}
              format="yyyy/MM/dd"
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('popupNotice.createPopupNotice')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export default PopupNoticeForm;
