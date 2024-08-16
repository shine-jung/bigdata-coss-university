import axios from 'axios';
import { useState } from 'react';

import { Box, Stack, alpha, Button, Typography } from '@mui/material';

import { fTimestampToDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { Notice } from 'src/domain/notice/notice';

import { useSnackbar } from 'src/components/snackbar';
import Markdown from 'src/components/markdown/markdown';

import NoticeForm from '../notice-creation/form';

const NoticeDetail = ({
  notice,
  onBack,
  refetchNotices,
}: {
  notice: Notice;
  onBack: () => void;
  refetchNotices: () => void;
}) => {
  const { t } = useTranslate();
  const { user, isAdmin } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditNotice = async (title: string, content: string) => {
    try {
      await axios.put(`/api/notices`, {
        id: notice.id,
        universityCode: user?.university,
        title,
        content,
        author: user?.name,
      });
      refetchNotices();
      setIsEditMode(false);
      onBack();
      enqueueSnackbar(t('notice.editNoticeSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('공지사항 수정 중 오류가 발생했습니다:', error);
      enqueueSnackbar(t('notice.editNoticeError'), { variant: 'error' });
    }
  };

  const handleDeleteNotice = async () => {
    if (!window.confirm(t('notice.deleteNoticePrompt'))) {
      return;
    }

    try {
      await axios.delete(`/api/notices`, {
        params: { id: notice.id, universityCode: user?.university },
      });
      refetchNotices();
      onBack();
      enqueueSnackbar(t('notice.deleteNoticeSuccess'), { variant: 'success' });
    } catch (error) {
      console.error('공지사항 삭제 중 오류가 발생했습니다:', error);
      enqueueSnackbar(t('notice.deleteNoticeError'), { variant: 'error' });
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
        <NoticeForm onAddNotice={handleEditNotice} notice={notice} isEditMode />
      ) : (
        <>
          <Typography variant="h4">{notice.title}</Typography>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="subtitle1" color="textSecondary">
              {t('notice.author')}: {notice.author}
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              {t('notice.createdAt')} : {fTimestampToDateTime(notice.createdAt)}
            </Typography>
          </Box>

          <Markdown children={notice.content} />
        </>
      )}

      <Stack direction="row" spacing={2} mt={5}>
        <Button variant="contained" onClick={onBack}>
          {t('common.back')}
        </Button>

        {isAdmin && !isEditMode && (
          <>
            <Button variant="contained" color="info" onClick={() => setIsEditMode(true)}>
              {t('notice.editNotice')}
            </Button>

            <Button variant="contained" color="error" onClick={handleDeleteNotice}>
              {t('notice.deleteNotice')}
            </Button>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default NoticeDetail;
