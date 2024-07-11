import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Stack, Backdrop, CircularProgress } from '@mui/material';

import { useTranslate } from 'src/locales';
import { Notice } from 'src/domain/notice/notice';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFEditor, RHFTextField } from 'src/components/hook-form';

const NoticeForm = ({
  onAddNotice,
  notice,
  isEditMode,
}: {
  onAddNotice: (title: string, content: string) => Promise<void>;
  notice?: Notice;
  isEditMode?: boolean;
}) => {
  const { t } = useTranslate();

  const NoticeSchema = Yup.object().shape({
    title: Yup.string().required(t('notice.titleRequired')),
    content: Yup.string().required(t('notice.contentRequired')),
  });

  const defaultValues = {
    title: notice?.title || '',
    content: notice?.content || '',
  };

  const methods = useForm({
    resolver: yupResolver(NoticeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await onAddNotice(data.title, data.content);
    if (!isEditMode) {
      setValue('title', '');
      setValue('content', '');
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
          <RHFTextField name="title" label={t('notice.title')} />

          <RHFEditor name="content" />

          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t(isEditMode ? 'notice.editNotice' : 'notice.createNotice')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
};

export default NoticeForm;
