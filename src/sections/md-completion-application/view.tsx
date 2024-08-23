'use client';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Table,
  Stack,
  Select,
  MenuItem,
  TableRow,
  Skeleton,
  Container,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  TableContainer,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';

import { useYearSemesterSelector } from 'src/hooks/use-year-semester-selector';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { Subject } from 'src/domain/md-process/subject';
import { MDProcess } from 'src/domain/md-process/md-process';
import { SubjectCategory } from 'src/domain/md-process/subject-category';

import Iconify from 'src/components/iconify';

import MDResult from './md-result';
import AddSubjectModal from './add-subject-modal';
import YearSemesterSelector from '../common/year-semester-selector';

// ----------------------------------------------------------------------

export default function MDCompletionApplicationView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { year, semester, yearOptions, setYear, setSemester } = useYearSemesterSelector();
  const [processes, setProcesses] = useState<MDProcess[]>([]);
  const [categories, setCategories] = useState<SubjectCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<MDProcess | null>(null);
  const [completedSubjects, setCompletedSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesSearchTerm, setCategoriesSearchTerm] = useState('');
  const [completedSubjectsSearchTerm, setCompletedSubjectsSearchTerm] = useState('');

  const userId = user?.id;
  const universityCode = user?.university;

  useEffect(() => {
    fetchProcesses();
    fetchCategoriesAndSubjects();
    fetchCompletedSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, year, semester]);

  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/md-process', {
        params: { universityCode, year, semester },
      });
      const initialProcess = response.data.processes.length > 0 ? response.data.processes[0] : null;
      setProcesses(response.data.processes || []);
      setSelectedProcess(initialProcess);
    } catch (error) {
      enqueueSnackbar('과정 목록을 가져오는 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndSubjects = async () => {
    setLoading(true);
    try {
      const [categoriesResponse, subjectsResponse] = await Promise.all([
        axios.get('/api/md-categories', {
          params: { universityCode, year, semester },
        }),
        axios.get('/api/md-subjects', {
          params: { universityCode, year, semester },
        }),
      ]);
      setCategories(categoriesResponse.data.categories || []);
      setSubjects(subjectsResponse.data.subjects || []);
    } catch (error) {
      enqueueSnackbar('과목 분류 및 과목 목록을 가져오는 중 오류가 발생했습니다.', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedSubjects = async () => {
    try {
      const response = await axios.get('/api/md-completed-subjects', {
        params: { userId, year, semester },
      });
      setCompletedSubjects(response.data.subjects || []);
    } catch (error) {
      enqueueSnackbar('수강한 과목을 가져오는 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const addSubject = async (subject: Subject) => {
    try {
      await axios.post('/api/md-completed-subjects', {
        userId,
        year,
        semester,
        subject,
      });
      fetchCompletedSubjects();
    } catch (error) {
      enqueueSnackbar('과목 추가 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const deleteSubject = async (subject: Subject) => {
    try {
      await axios.delete('/api/md-completed-subjects', {
        data: { userId, year, semester, subject },
      });
      fetchCompletedSubjects();
    } catch (error) {
      enqueueSnackbar('과목 삭제 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleProcessChange = (event: SelectChangeEvent) => {
    const process = processes.find((matchingProcess) => matchingProcess.id === event.target.value);
    setSelectedProcess(process || null);
  };

  const handleSearchChange =
    (setSearchTerm: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };

  const renderProcessSelect = () => (
    <FormControl fullWidth>
      <InputLabel id="process-select-label" size="small">
        과정 선택
      </InputLabel>
      <Select
        labelId="process-select-label"
        id="process-select"
        value={selectedProcess?.id || ''}
        onChange={handleProcessChange}
        size="small"
        label="과정 선택"
      >
        {processes.map((process) => (
          <MenuItem key={process.id} value={process.id}>
            {process.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderSubjectTable = (
    data: SubjectCategory[] | Subject[],
    columns: string[],
    renderRow: (item: any) => React.ReactNode
  ) => (
    <TableContainer
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        height: 500,
        overflow: 'auto',
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} align={column === '명칭' ? 'left' : 'center'}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{data.map(renderRow)}</TableBody>
      </Table>
    </TableContainer>
  );

  const filteredCategories = categories.filter(
    (category) =>
      selectedProcess?.id === category.processId && category.name.includes(categoriesSearchTerm)
  );

  const filteredCompletedSubjects = completedSubjects.filter(
    (subject) =>
      selectedProcess?.id === subject.processId &&
      subject.name?.includes(completedSubjectsSearchTerm)
  );

  const renderCategoriesTable = () =>
    renderSubjectTable(filteredCategories, ['연번', '구분', '코드', '명칭', '추가'], (category) => {
      const isAdded = completedSubjects.some(
        (subject) =>
          subject.processId === category.processId && subject.categoryNumber === category.number
      );
      return (
        <TableRow key={category.id}>
          <TableCell align="center">{category.number}</TableCell>
          <TableCell align="center">{category.type}</TableCell>
          <TableCell align="center">{category.code}</TableCell>
          <TableCell>{category.name}</TableCell>
          <TableCell align="center">
            <Stack alignItems="center" justifyContent="center">
              {isAdded ? (
                <IconButton size="small" disabled>
                  <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" />
                </IconButton>
              ) : (
                <AddSubjectModal
                  processId={selectedProcess!.id}
                  category={category}
                  subjects={subjects}
                  completedSubjects={completedSubjects}
                  isAdded={isAdded}
                  addSubject={addSubject}
                />
              )}
            </Stack>
          </TableCell>
        </TableRow>
      );
    });

  const renderCompletedSubjectsTable = () =>
    renderSubjectTable(
      filteredCompletedSubjects,
      ['과목코드', '명칭', '학점', '삭제'],
      (subject) => (
        <TableRow key={subject.id}>
          <TableCell>{subject.code}</TableCell>
          <TableCell>{subject.name}</TableCell>
          <TableCell align="center">{subject.credit}</TableCell>
          <TableCell align="center">
            <IconButton size="small" onClick={() => deleteSubject(subject)}>
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </TableCell>
        </TableRow>
      )
    );

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h4">{t('nav.MDCompletionApplication')}</Typography>

        <YearSemesterSelector
          year={year}
          semester={semester}
          setYear={setYear}
          setSemester={setSemester}
          yearOptions={yearOptions}
          size="small"
        />
      </Stack>

      {loading ? (
        <Skeleton variant="rounded" height={500} />
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" height={40}>
                {renderProcessSelect()}
              </Stack>

              <TextField
                label="과목 분류 검색"
                placeholder="과목 분류를 검색하세요..."
                fullWidth
                onChange={handleSearchChange(setCategoriesSearchTerm)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" />
                    </InputAdornment>
                  ),
                }}
              />

              {renderCategoriesTable()}
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" height={40}>
                <Typography variant="h5">수강한 과목</Typography>
                <MDResult
                  processes={processes}
                  completedSubjects={completedSubjects}
                  year={year}
                  semester={semester}
                />
              </Stack>

              <TextField
                label="과목 검색"
                placeholder="수강한 과목을 검색하세요..."
                fullWidth
                onChange={handleSearchChange(setCompletedSubjectsSearchTerm)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" />
                    </InputAdornment>
                  ),
                }}
              />

              {renderCompletedSubjectsTable()}
            </Stack>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
