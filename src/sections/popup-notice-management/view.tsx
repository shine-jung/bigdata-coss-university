'use client';

import { Box, Grid, Stack, Skeleton, Container, Typography } from '@mui/material';

import { useFetchPopupNotice } from 'src/hooks/use-fetch-popup-notice';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Image from 'src/components/image';

import PopupNoticeForm from './form';

const PopupNoticeView = () => {
  const { t } = useTranslate();

  const { user } = useAuthContext();
  const universityCode = user?.university;

  const { popupNotice, loading, refetch } = useFetchPopupNotice(universityCode);

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        {t('nav.popupNoticeManagement')}
      </Typography>

      <Grid container spacing={3} direction={{ xs: 'column', sm: 'row' }}>
        <Grid item xs={12} md={6}>
          <Box
            p={2}
            sx={{
              borderRadius: 2,
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" mb={3}>
              {t('popupNotice.currentPopupNotice')}
            </Typography>

            {loading ? (
              <Stack spacing={1.5}>
                <Skeleton />
                <Skeleton variant="rectangular" height={500} />
                <Skeleton />
              </Stack>
            ) : (
              <>
                {popupNotice ? (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('popupNotice.currentTitle', { title: popupNotice.title })}
                    </Typography>
                    <Image src={popupNotice.imageUrl} alt="Popup Notice" />
                    <Typography variant="subtitle2" mt={1}>
                      {t('popupNotice.currentExpiryDate', {
                        expiryDate: new Date(popupNotice.expiryDate).toLocaleDateString(),
                      })}
                    </Typography>
                  </Box>
                ) : (
                  <Typography>{t('popupNotice.noCurrentPopupNotice')}</Typography>
                )}
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            p={2}
            sx={{
              borderRadius: 2,
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" mb={3}>
              {t('popupNotice.createPopupNotice')}
            </Typography>

            <PopupNoticeForm universityCode={universityCode} refetch={refetch} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PopupNoticeView;
