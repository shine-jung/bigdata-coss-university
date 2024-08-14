import React from 'react';

import { Stack, Button, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

interface ExcelUploadSectionProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onClickExcelUpload: () => void;
}

export default function ExcelUploadSection({
  file,
  setFile,
  onClickExcelUpload,
}: ExcelUploadSectionProps) {
  const { t } = useTranslate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFile(files[0]);
      e.target.value = '';
    }
  };

  return (
    <Stack flexDirection="row" spacing={2} alignItems="center">
      <Button
        variant="contained"
        component="label"
        startIcon={<Iconify icon="eva:file-text-fill" />}
      >
        {t('mileageManagement.excelSelect')}
        <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileChange} />
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={onClickExcelUpload}
        startIcon={<Iconify icon="eva:upload-fill" />}
        disabled={!file}
      >
        {t('mileageManagement.excelUpload')}
      </Button>

      {file && <Typography variant="subtitle2">{file.name}</Typography>}
    </Stack>
  );
}
