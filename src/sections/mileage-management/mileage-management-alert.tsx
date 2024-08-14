import React from 'react';
import { Trans } from 'react-i18next';

import { Alert, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

export default function MileageManagementAlert() {
  const { t } = useTranslate();

  return (
    <Alert severity="info">
      <Typography gutterBottom>{t('mileageManagement.alert.title')}</Typography>
      <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
        <li>
          <Trans
            i18nKey="mileageManagement.alert.instructions.fieldNameInFirstColumn"
            components={{ strong: <strong /> }}
          />
        </li>
        <li>
          <Trans
            i18nKey="mileageManagement.alert.instructions.allowedFieldTypes"
            components={{ strong: <strong /> }}
          />
        </li>
        <li>
          <Trans
            i18nKey="mileageManagement.alert.instructions.defaultPoints"
            components={{ strong: <strong /> }}
          />
        </li>
      </ul>
      <Typography gutterBottom>
        <Trans
          i18nKey="mileageManagement.alert.additionalInfo.modifyScores"
          components={{ strong: <strong /> }}
        />
      </Typography>
      <Typography>
        <Trans
          i18nKey="mileageManagement.alert.additionalInfo.dataAggregationWarning"
          components={{ strong: <strong /> }}
        />
      </Typography>
    </Alert>
  );
}
