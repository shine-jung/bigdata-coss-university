import React from 'react';

import {
  Stack,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

interface AreaListProps {
  areas: MileageArea[];
}

export default function AreaList({ areas }: AreaListProps) {
  const { t } = useTranslate();

  return (
    <>
      {areas.map((area, index) => (
        <Stack key={index}>
          <Typography variant="h4">
            {area.name} {t('mileageManagement.area')}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {t('mileageManagement.defaultPoints', { points: area.defaultPoints })}
          </Typography>
          <TableContainer
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('mileageManagement.fieldName')}</TableCell>
                  <TableCell>{t('mileageManagement.fieldType')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {area.fields.map((field, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{field.name}</TableCell>
                    <TableCell>{field.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      ))}
    </>
  );
}
