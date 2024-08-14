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

import { Course } from 'src/domain/mileage-management/course';

interface CourseCompletionFormProps {
  subjectType: number;
  courses: Course[];
  errors: any;
  year: string;
  yearOptions: string[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (name: string, value: any) => void;
}

export const CourseCompletionForm = ({
  subjectType,
  courses,
  errors,
  year,
  yearOptions,
  handleChange,
  setValue,
}: CourseCompletionFormProps) => {
  const { register, control } = useFormContext();

  return (
    <Stack sx={{ width: 440 }} spacing={2}>
      <Stack>
        <InputLabel>과목 유형</InputLabel>
        <RadioGroup value={subjectType} onChange={handleChange}>
          <FormControlLabel value={1} control={<Radio color="primary" />} label="본교 교과목" />
          <FormControlLabel value={0} control={<Radio color="primary" />} label="학점교류 교과목" />
        </RadioGroup>
      </Stack>

      <Stack flexDirection="row" spacing={2}>
        <Stack flex={2}>
          <InputLabel>과목명</InputLabel>
          {subjectType ? (
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
                  placeholder="과목을 선택해주세요."
                  size="small"
                  fullWidth
                  hiddenLabel
                  error={Boolean(errors?.과목코드)}
                />
              )}
              noOptionsText="찾는 과목이 없습니다."
            />
          ) : (
            <TextField
              placeholder="과목명을 입력해주세요."
              size="small"
              fullWidth
              hiddenLabel
              {...register('과목명', {
                required: '필수 항목입니다.',
              })}
              error={Boolean(errors?.과목명)}
            />
          )}
        </Stack>
        <Stack flex={1}>
          <InputLabel>과목코드</InputLabel>
          <TextField
            placeholder={subjectType ? '자동 입력' : ''}
            size="small"
            InputProps={{
              readOnly: Boolean(subjectType),
            }}
            fullWidth
            hiddenLabel
            {...register('과목코드', {
              required: '필수 항목입니다.',
            })}
            error={Boolean(errors?.과목코드)}
          />
        </Stack>
      </Stack>

      <Stack flexDirection="row" spacing={2}>
        <Stack flex={1}>
          <InputLabel>년도</InputLabel>
          <FormControl fullWidth hiddenLabel size="small">
            <Select
              {...register('년도', {
                required: '필수 항목입니다.',
              })}
              defaultValue={year}
              displayEmpty
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
          <InputLabel>학기</InputLabel>
          <FormControl fullWidth hiddenLabel size="small">
            <Select
              {...register('학기', {
                required: '필수 항목입니다.',
              })}
              defaultValue=""
              error={Boolean(errors?.학기)}
            >
              {[1, 2, 3, 4].map((semesterOption) => (
                <MenuItem key={semesterOption} value={semesterOption}>
                  {semesterOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack flex={1}>
          <InputLabel>성적</InputLabel>
          <FormControl fullWidth hiddenLabel size="small">
            <Select
              {...register('성적', {
                required: '필수 항목입니다.',
              })}
              defaultValue=""
              error={Boolean(errors?.성적)}
            >
              {['A+', 'A0', 'A-', 'B+', 'PD', 'P'].map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack flex={1}>
          <InputLabel>이수학점</InputLabel>
          <TextField
            type="number"
            placeholder={subjectType ? '자동 입력' : ''}
            size="small"
            InputProps={{
              readOnly: Boolean(subjectType),
            }}
            fullWidth
            hiddenLabel
            {...register('이수학점', {
              required: '필수 항목입니다.',
              valueAsNumber: true,
            })}
            error={Boolean(errors?.이수학점)}
          />
        </Stack>
      </Stack>

      <Stack flexDirection="row" spacing={2}>
        <Stack flex={1}>
          <InputLabel>담당교수</InputLabel>
          <TextField
            size="small"
            fullWidth
            hiddenLabel
            {...register('담당교수', {
              required: '필수 항목입니다.',
            })}
            error={Boolean(errors?.담당교수)}
          />
        </Stack>
        <Stack flex={2}>
          <InputLabel>비고</InputLabel>
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
        <InputLabel>PBL 여부{subjectType ? ' (자동 입력)' : ''}</InputLabel>
        <Controller
          name="PBL여부"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              color="primary"
              checked={field.value}
              onChange={(e) => {
                if (subjectType === 0) field.onChange(e.target.checked);
              }}
              readOnly={subjectType === 1}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};
