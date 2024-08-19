'use client';

import axios from 'axios';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { Stack, Alert, Button, Skeleton, Container, Typography } from '@mui/material';

import { useYearSemesterSelector } from 'src/hooks/use-year-semester-selector';

import { useTranslate } from 'src/locales';
import { AdminGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { Subject } from 'src/domain/md-process/subject';
import { MDProcess } from 'src/domain/md-process/md-process';
import { SubjectCategory } from 'src/domain/md-process/subject-category';

import Iconify from 'src/components/iconify';

import { ProcessModal } from './process-modal';
import { ProcessTable } from './process-table';
import { SubjectTable } from './subject-table';
import { CategoryTable } from './category-table';
import ExcelDownloadButton from './excel-download-button';
import ExcelUploadSection from '../common/excel-upload-section';
import YearSemesterSelector from '../common/year-semester-selector';

// ----------------------------------------------------------------------

export default function MDCourseManagementView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { year, semester, yearOptions, setYear, setSemester } = useYearSemesterSelector();
  const [loading, setLoading] = useState(false);
  const [processes, setProcesses] = useState<MDProcess[]>([]);
  const [categories, setCategories] = useState<SubjectCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<Partial<MDProcess>>({});
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const universityCode = user?.university;

  useEffect(() => {
    fetchProcesses();
    fetchCategoriesAndSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityCode, year, semester]);

  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/md-process', {
        params: { universityCode, year, semester },
      });
      setProcesses(response.data.processes || []);
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

  const handleAddProcess = async () => {
    try {
      if (!selectedProcess.name) {
        enqueueSnackbar('과정 이름을 입력해주세요.', { variant: 'warning' });
        return;
      }

      const process: MDProcess = {
        id: uuidv4(),
        name: selectedProcess.name,
        minStandardCourses: selectedProcess.minStandardCourses || 0,
        minLinkedCourses: selectedProcess.minLinkedCourses || 0,
        minCompulsoryCourses: selectedProcess.minCompulsoryCourses || 0,
        minOptionalCourses: selectedProcess.minOptionalCourses || 0,
        minRequiredCredits: selectedProcess.minRequiredCredits || 0,
        requiresCompulsoryCourses: selectedProcess.requiresCompulsoryCourses || false,
      };

      await axios.post('/api/md-process', {
        universityCode,
        year,
        semester,
        process,
      });

      enqueueSnackbar('과정이 성공적으로 저장되었습니다.', { variant: 'success' });
      fetchProcesses();
      setOpenProcessModal(false);
    } catch (error) {
      enqueueSnackbar('과정을 저장하는 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleEditProcess = async () => {
    if (!selectedProcess.id) return;

    try {
      if (!selectedProcess.name) {
        enqueueSnackbar('과정 이름을 입력해주세요.', { variant: 'warning' });
        return;
      }

      await axios.put('/api/md-process', {
        universityCode,
        year,
        semester,
        process: selectedProcess,
      });

      enqueueSnackbar('과정이 성공적으로 수정되었습니다.', { variant: 'success' });
      fetchProcesses();
      setOpenProcessModal(false);
    } catch (error) {
      enqueueSnackbar('과정을 수정하는 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleDeleteProcess = async (processId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await axios.delete('/api/md-process', {
        data: { universityCode, year, semester, processId },
      });

      enqueueSnackbar('과정이 성공적으로 삭제되었습니다.', { variant: 'success' });
      fetchProcesses();
      setOpenProcessModal(false);
    } catch (error) {
      enqueueSnackbar('과정을 삭제하는 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      const categoriesSheet = workbook.Sheets.Categories;
      const subjectsSheet = workbook.Sheets.Subjects;

      const categoryData: SubjectCategory[] = XLSX.utils.sheet_to_json(categoriesSheet);
      const subjectData: Subject[] = XLSX.utils.sheet_to_json(subjectsSheet);

      categoryData.forEach((category) => {
        if (!category.name || !category.number) {
          throw new Error('분류 데이터에 필수 필드가 누락되었습니다. (name, serialCode)');
        }
        if (!category.id) category.id = uuidv4();
      });

      subjectData.forEach((subject) => {
        if (!subject.categoryNumber || !subject.code) {
          throw new Error('과목 데이터에 필수 필드가 누락되었습니다. (subjectName, subjectCode)');
        }
        if (!subject.id) subject.id = uuidv4();
      });

      await axios.post('/api/md-categories', {
        universityCode,
        year,
        semester,
        categories: categoryData,
      });

      await axios.post('/api/md-subjects', {
        universityCode,
        year,
        semester,
        subjects: subjectData,
      });

      enqueueSnackbar('엑셀 파일이 성공적으로 업로드되었습니다.', { variant: 'success' });
      fetchProcesses();
      fetchCategoriesAndSubjects();
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(`엑셀 파일 처리 중 오류가 발생했습니다: ${error.message}`, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('엑셀 파일 처리 중 알 수 없는 오류가 발생했습니다.', { variant: 'error' });
      }
    }
  };

  const onClickAddProcess = () => {
    setSelectedProcess({});
    setOpenProcessModal(true);
  };

  const onClickEditProcess = (process: MDProcess) => {
    setSelectedProcess(process);
    setOpenProcessModal(true);
  };

  return (
    <AdminGuard>
      <Container>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h4">{t('nav.MDCourseManagement')}</Typography>

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
          <Stack spacing={3}>
            <Alert severity="warning">{t('mdProcess.warningMessage')}</Alert>

            <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
              <Stack flexDirection="row" spacing={2}>
                <ExcelDownloadButton />

                {categories && subjects && (
                  <ExcelDownloadButton categories={categories} subjects={subjects} />
                )}
              </Stack>

              <Button
                variant="contained"
                onClick={onClickAddProcess}
                color="primary"
                startIcon={<Iconify icon="eva:plus-outline" />}
              >
                {t('mdProcess.process.add')}
              </Button>
            </Stack>

            <Stack>
              <Typography variant="h6" gutterBottom>
                {t('mdProcess.process.list')}
              </Typography>
              <ProcessTable
                processes={processes}
                onEdit={onClickEditProcess}
                onDelete={handleDeleteProcess}
              />
            </Stack>

            <Stack>
              <Typography variant="h6" gutterBottom>
                {t('mdProcess.category.list')}
              </Typography>
              <CategoryTable categories={categories} />
            </Stack>

            <Stack>
              <Typography variant="h6" gutterBottom>
                {t('mdProcess.subject.list')}
              </Typography>
              <SubjectTable subjects={subjects} />
            </Stack>

            <ExcelUploadSection
              file={file}
              setFile={setFile}
              onClickExcelUpload={handleFileUpload}
            />
          </Stack>
        )}

        <ProcessModal
          open={openProcessModal}
          process={selectedProcess}
          onClose={() => setOpenProcessModal(false)}
          onSave={() => (selectedProcess.id ? handleEditProcess() : handleAddProcess())}
          setProcess={setSelectedProcess}
        />
      </Container>
    </AdminGuard>
  );
}
