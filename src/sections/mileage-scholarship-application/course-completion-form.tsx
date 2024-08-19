import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Stack,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  RadioGroup,
  InputLabel,
  FormControl,
  Autocomplete,
  FormControlLabel,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { Course } from 'src/domain/mileage-management/course';

const SEMESTER_OPTIONS = [1, 2, 3, 4];
const GRADE_OPTIONS = ['A+', 'A0', 'A-', 'B+', 'PD', 'P'];

interface CourseCompletionFormProps {
  subjectType: number;
  courses: Course[];
  errors: any;
  yearOptions: string[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (name: string, value: any) => void;
}

export const CourseCompletionForm = ({
  subjectType,
  courses,
  errors,
  yearOptions,
  handleChange,
  setValue,
}: CourseCompletionFormProps) => {
  const { t } = useTranslate();
  const { register, control } = useFormContext();

  return (
    <Stack sx={{ width: 440 }} spacing={2}>
      <Stack>
        <InputLabel>{t('mileageApplication.courseCompletion.subjectType')}</InputLabel>
        <RadioGroup value={subjectType} onChange={handleChange}>
          <FormControlLabel
            value={1}
            control={<Radio color="primary" />}
            label={t('mileageApplication.courseCompletion.localCourse')}
          />
          <FormControlLabel
            value={2}
            control={<Radio color="primary" />}
            label={t('mileageApplication.courseCompletion.creditExchangeCourse')}
          />
        </RadioGroup>
      </Stack>

      <Stack flexDirection="row" spacing={2}>
        <Stack flex={2}>
          <InputLabel>{t('mileageApplication.courseCompletion.subjectName')}</InputLabel>
          {subjectType === 1 ? (
            <Autocomplete
              options={courses}
              getOptionLabel={(option: Course) => option.name}
              onChange={(event: any, newValue: Course | null) => {
                setValue('과목코드', newValue?.code ?? '');
                setValue('과목명', newValue?.name ?? '');
                setValue('이수학점', newValue?.credit ?? 0);
                setValue('PBL여부', newValue?.isPBL ?? false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t('mileageApplication.courseCompletion.selectSubject')}
                  size="small"
                  fullWidth
                  hiddenLabel
                  error={Boolean(errors?.과목코드)}
                />
              )}
              noOptionsText={t('mileageApplication.courseCompletion.noSubject')}
            />
          ) : (
            <TextField
              placeholder={t('mileageApplication.courseCompletion.enterSubject')}
              size="small"
              fullWidth
              hiddenLabel
              {...register('과목명', {
                required: t('mileageApplication.courseCompletion.required'),
              })}
              error={Boolean(errors?.과목명)}
            />
          )}
        </Stack>
        <Stack flex={1}>
          <InputLabel>{t('mileageApplication.courseCompletion.subjectCode')}</InputLabel>
          <TextField
            placeholder={
              subjectType === 1 ? t('mileageApplication.courseCompletion.autoInput') : ''
            }
            size="small"
            InputProps={{ readOnly: subjectType === 1 }}
            fullWidth
            hiddenLabel
            {...register('과목코드', {
              required: t('mileageApplication.courseCompletion.required'),
            })}
            error={Boolean(errors?.과목코드)}
          />
        </Stack>
      </Stack>

      <Stack flexDirection="row" spacing={2}>
        <Stack flex={1}>
          <InputLabel>{t('mileageApplication.courseCompletion.year')}</InputLabel>
          <FormControl fullWidth hiddenLabel size="small">
            <Select
              {...register('년도', {
                required: t('mileageApplication.courseCompletion.required'),
              })}
              defaultValue=""
              error={Boolean(errors?.년도)}
            >
              {yearOptions.map((yearOption) => (
                <MenuItem key={yearOption} value={yearOption}>
                  {yearOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack flex={1}>
          <InputLabel>{t('mileageApplication.courseCompletion.semester')}</InputLabel>
          <FormControl fullWidth hiddenLabel size="small">
            <Select
              {...register('학기', {
                required: t('mileageApplication.courseCompletion.required'),
              })}
              defaultValue=""
              error={Boolean(errors?.학기)}
            >
              {SEMESTER_OPTIONS.map((semesterOption) => (
                <MenuItem key={semesterOption} value={semesterOption}>
                  {semesterOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack flex={1}>
          <InputLabel>{t('mileageApplication.courseCompletion.grade')}</InputLabel>
          <FormControl fullWidth hiddenLabel size="small">
            <Select
              {...register('성적', {
                required: t('mileageApplication.courseCompletion.required'),
              })}
              defaultValue=""
              error={Boolean(errors?.성적)}
            >
              {GRADE_OPTIONS.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack flex={1}>
          <InputLabel>{t('mileageApplication.courseCompletion.credit')}</InputLabel>
          <TextField
            type="number"
            placeholder={
              subjectType === 1 ? t('mileageApplication.courseCompletion.autoInput') : ''
            }
            size="small"
            InputProps={{ readOnly: subjectType === 1 }}
            fullWidth
            hiddenLabel
            {...register('이수학점', {
              required: t('mileageApplication.courseCompletion.required'),
              valueAsNumber: true,
            })}
            error={Boolean(errors?.이수학점)}
          />
        </Stack>
      </Stack>

      <Stack flexDirection="row" spacing={2}>
        <Stack flex={1}>
          <InputLabel>{t('mileageApplication.courseCompletion.professor')}</InputLabel>
          <TextField
            size="small"
            fullWidth
            hiddenLabel
            {...register('담당교수', {
              required: t('mileageApplication.courseCompletion.required'),
            })}
            error={Boolean(errors?.담당교수)}
          />
        </Stack>
        <Stack flex={2}>
          <InputLabel>{t('mileageApplication.courseCompletion.remarks')}</InputLabel>
          <TextField
            size="small"
            fullWidth
            hiddenLabel
            {...register('비고')}
            error={Boolean(errors?.비고)}
          />
        </Stack>
      </Stack>

      <Stack flexDirection="row" spacing={0.5} alignItems="center">
        <InputLabel>
          {t('mileageApplication.courseCompletion.PBL')}
          {subjectType === 1 ? ` (${t('mileageApplication.courseCompletion.autoInput')})` : ''}
        </InputLabel>
        <Controller
          name="PBL여부"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              color="primary"
              checked={field.value ?? false}
              onChange={(e) => {
                if (subjectType === 2) field.onChange(e.target.checked);
              }}
              readOnly={subjectType === 1}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};
