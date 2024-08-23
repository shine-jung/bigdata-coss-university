'use client';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useYearSemesterSelector } from 'src/hooks/use-year-semester-selector';

import { useTranslate } from 'src/locales';
import { AdminGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import AreaList from './area-list';
import ExcelDownloadButton from './excel-download-button';
import { handleExcelFileUpload } from './utils/excel-utils';
import ExcelUploadSection from '../common/excel-upload-section';
import MileageManagementAlert from './mileage-management-alert';
import CourseCompletionSection from './course-completion-section';
import YearSemesterSelector from '../common/year-semester-selector';
import { COURSE_COMPLETION_AREA_INITIAL_NAME } from './constants/preset-areas';
import EditCourseCompletionNameModal from './edit-course-completion-name-modal';

// ----------------------------------------------------------------------

export default function MileageManagementView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const { year, semester, yearOptions, setYear, setSemester } = useYearSemesterSelector();

  const universityCode = user?.university;
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [areas, setAreas] = useState<MileageArea[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const courseCompletionArea = areas?.find((area) => area.isCourseCompletion);
  const courseCompletionName = courseCompletionArea?.name;
  const isCourseCompletionActive = !!courseCompletionArea;

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/mileage', {
        params: { universityCode, year, semester },
      });
      setAreas(response.data.areas || []);
    } catch (error) {
      setAreas(null);
      enqueueSnackbar(error.response.data.error || '영역 정보를 가져오는 중 오류가 발생했습니다.', {
        variant: 'error',
      });
      console.error('영역 정보를 가져오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const onClickExcelUpload = async () => {
    if (!file) {
      enqueueSnackbar('엑셀 파일을 선택해주세요.', { variant: 'warning' });
      return;
    }

    await handleExcelFileUpload(file, universityCode, year, semester, fetchAreas);
  };

  useEffect(() => {
    if (universityCode && year && semester) {
      fetchAreas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityCode, year, semester]);

  const handleCourseCompletionNameChange = async (newName: string) => {
    const updatedAreas = areas?.map((area) =>
      area.isCourseCompletion ? { ...area, name: newName } : area
    );

    if (updatedAreas) {
      try {
        await axios.post('/api/mileage', {
          universityCode,
          year,
          semester,
          areas: updatedAreas,
        });

        fetchAreas();
        enqueueSnackbar('영역 이름이 성공적으로 변경되었습니다.', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('영역 이름 변경 중 오류가 발생했습니다.', { variant: 'error' });
      }
    }
  };

  return (
    <AdminGuard>
      <Container>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h4">{t('nav.mileageManagement')}</Typography>

          <YearSemesterSelector
            year={year}
            semester={semester}
            setYear={setYear}
            setSemester={setSemester}
            yearOptions={yearOptions}
            size="small"
          />
        </Stack>

        <Stack spacing={3}>
          {loading ? (
            <Skeleton variant="rounded" height={500} />
          ) : (
            <>
              <Stack flexDirection="row" spacing={2}>
                <ExcelDownloadButton />

                {areas && <ExcelDownloadButton mileageAreas={areas} />}
              </Stack>

              <MileageManagementAlert />

              <CourseCompletionSection
                isCourseCompletionActive={isCourseCompletionActive}
                setIsModalOpen={setIsModalOpen}
                fetchAreas={fetchAreas}
                areas={areas}
                universityCode={universityCode}
                year={year}
                semester={semester}
              />

              {areas && <AreaList areas={areas.sort((a, b) => (a.isCourseCompletion ? -1 : 1))} />}

              <ExcelUploadSection
                file={file}
                setFile={setFile}
                onClickExcelUpload={onClickExcelUpload}
              />

              <Alert severity="info">
                {areas && areas.length > 0 ? (
                  <>{t('mileageManagement.alert.update', { year, semester })}</>
                ) : (
                  <>{t('mileageManagement.alert.select')}</>
                )}
              </Alert>
            </>
          )}
        </Stack>

        <EditCourseCompletionNameModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCourseCompletionNameChange}
          existingName={courseCompletionName}
          initialName={COURSE_COMPLETION_AREA_INITIAL_NAME}
        />
      </Container>
    </AdminGuard>
  );
}
