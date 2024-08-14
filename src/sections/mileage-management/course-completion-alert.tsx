import { Trans } from 'react-i18next';

import { Alert, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

export default function CourseCompletionAlert() {
  const { t } = useTranslate();

  return (
    <Alert>
      <Typography gutterBottom>
        <Trans i18nKey="mileageManagement.courseCompletionAlert.description">
          {t('mileageManagement.courseCompletionAlert.description')}
        </Trans>
      </Typography>
      <Typography gutterBottom>
        <Trans i18nKey="mileageManagement.courseCompletionAlert.toggleDescription">
          {t('mileageManagement.courseCompletionAlert.toggleDescription')}
        </Trans>
      </Typography>
      <Typography>
        <Trans
          i18nKey="mileageManagement.courseCompletionAlert.handongUsage"
          components={{ strong: <strong /> }}
        />
      </Typography>
    </Alert>
  );
}
