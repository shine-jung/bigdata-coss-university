import React from 'react';

import { Stack, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { useTranslate } from 'src/locales';

interface YearSemesterSelectorProps {
  year: string;
  semester: string;
  setYear: (year: string) => void;
  setSemester: (semester: string) => void;
  yearOptions: string[];
  size?: 'small' | 'medium';
}

export default function YearSemesterSelector({
  year,
  semester,
  setYear,
  setSemester,
  yearOptions,
  size = 'medium',
}: YearSemesterSelectorProps) {
  const { t } = useTranslate();

  return (
    <Stack flexDirection="row" spacing={2}>
      <FormControl fullWidth margin="normal" sx={{ minWidth: 100 }}>
        <InputLabel>{t('mileageManagement.year')}</InputLabel>
        <Select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          label={t('mileageManagement.year')}
          size={size}
        >
          {yearOptions.map((y) => (
            <MenuItem key={y} value={y}>
              {t('mileageManagement.yearOption', { year: y })}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" sx={{ minWidth: 100 }}>
        <InputLabel>{t('mileageManagement.semester')}</InputLabel>
        <Select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          label={t('mileageManagement.semester')}
          size={size}
        >
          <MenuItem value="1">{t('mileageManagement.semesterOption', { semester: '1' })}</MenuItem>
          <MenuItem value="2">{t('mileageManagement.semesterOption', { semester: '2' })}</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
