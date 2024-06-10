import { Box, Stack, alpha, Button, Typography } from '@mui/material';

import { fTimestampToDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { Notice } from 'src/domain/notice/notice';

import Markdown from 'src/components/markdown/markdown';

const NoticeDetail = ({ notice, onBack }: { notice: Notice; onBack: () => void }) => {
  const { t } = useTranslate();

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
      <Typography variant="h4">{notice.title}</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" color="textSecondary">
          {t('notice.author')}: {notice.author}
        </Typography>

        <Typography variant="subtitle1" color="textSecondary">
          {t('notice.createdAt')} : {fTimestampToDateTime(notice.createdAt)}
        </Typography>
      </Box>

      <Markdown children={notice.content} />

      <Button variant="contained" onClick={onBack} sx={{ alignSelf: 'flex-start', mt: 5 }}>
        {t('common.back')}
      </Button>
    </Stack>
  );
};

export default NoticeDetail;
