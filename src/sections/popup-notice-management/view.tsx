'use client';

import { Box, Grid, Container, Typography } from '@mui/material';

import { useFetchPopupNotice } from 'src/hooks/use-fetch-popup-notice';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Image from 'src/components/image';

import PopupNoticeForm from './form';

const PopupNoticeView = () => {
  const { t } = useTranslate();

  const { user } = useAuthContext();
  const universityCode = user?.university;

  const { popupNotice, refetch } = useFetchPopupNotice(universityCode);

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        {t('nav.popupNoticeManagement')}
      </Typography>

      <Grid container spacing={3} direction={{ xs: 'column', sm: 'row' }}>
        <Grid item xs={12} md={6}>
          <Box p={2} border={1} borderRadius={2} borderColor="divider">
            <Typography variant="h5" gutterBottom>
              {t('popupNotice.currentPopupNotice')}
            </Typography>

            {popupNotice ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('popupNotice.currentTitle', { title: popupNotice.title })}
                </Typography>
                <Image src={popupNotice.imageUrl} alt="Popup Notice" />
                <Typography variant="subtitle1" mt={2}>
                  {t('popupNotice.currentExpiryDate', {
                    expiryDate: new Date(popupNotice.expiryDate).toLocaleDateString(),
                  })}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1">{t('popupNotice.noCurrentPopupNotice')}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box p={2} border={1} borderRadius={2} borderColor="divider">
            <Typography variant="h5" mb={4}>
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
