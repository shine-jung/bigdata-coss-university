import axios from 'axios';
import * as XLSX from 'xlsx';
import { isNaN } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import {
  Table,
  Stack,
  Alert,
  Dialog,
  Button,
  TableRow,
  Skeleton,
  TableBody,
  TableCell,
  TableHead,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { Course } from 'src/domain/mileage-management/course';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

import ExcelUploadSection from './excel-upload-section';
import { COURSE_SAMPLE_WORKSHEET_DATA } from './constants/preset-areas';

const TABLE_HEIGHT = 400;
const WORKSHEET_HEADER = ['code', 'name', 'credit', 'isPBL'];

interface ManageCourseListModalProps {
  open: boolean;
  onClose: () => void;
  universityCode: string;
  year: string;
  semester: string;
}

export default function ManageCourseListModal({
  open,
  onClose,
  universityCode,
  year,
  semester,
}: ManageCourseListModalProps) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState<File | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses', {
        params: { universityCode, year, semester },
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      enqueueSnackbar('교과목 목록을 가져오는 중 오류가 발생했습니다.', { variant: 'error' });
      setCourses(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, universityCode, year, semester, enqueueSnackbar]);

  const handleDownloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(COURSE_SAMPLE_WORKSHEET_DATA, {
      header: WORKSHEET_HEADER,
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'course-template.xlsx');
  };

  const handleDownloadCourses = () => {
    if (!courses || courses.length === 0) {
      enqueueSnackbar('다운로드할 교과목 목록이 없습니다.', { variant: 'warning' });
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheetData = courses.map((course) => ({
      code: course.code,
      name: course.name,
      credit: course.credit,
      isPBL: course.isPBL,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: WORKSHEET_HEADER,
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses');
    XLSX.writeFile(workbook, `courses_${year}_${semester}.xlsx`);
  };

  const handleFileUpload = async () => {
    if (!file) {
      enqueueSnackbar('엑셀 파일을 선택해주세요.', { variant: 'warning' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target) {
        enqueueSnackbar('엑셀 파일을 읽을 수 없습니다.', { variant: 'error' });
        return;
      }
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });

      try {
        const parsedCourseList = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
          header: WORKSHEET_HEADER,
        }) as Course[];

        const validCourses = parsedCourseList.filter((row, index) => {
          if (index === 0) return false;

          if (typeof row.credit !== 'number' || isNaN(row.credit)) {
            throw new Error(`시트 "${workbook.SheetNames[0]}"에서 이수학점이 올바르지 않습니다.`);
          }

          if (typeof row.isPBL !== 'boolean') {
            throw new Error(`시트 "${workbook.SheetNames[0]}"에서 PBL 여부가 올바르지 않습니다.`);
          }

          return true;
        });

        await axios.post('/api/courses', {
          universityCode,
          year,
          semester,
          courses: validCourses,
        });

        fetchCourses();
        enqueueSnackbar('교과목 목록이 성공적으로 업로드되었습니다.', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(error.message || '업로드 중 오류가 발생했습니다.', { variant: 'error' });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('mileageManagement.manageCourseList')}</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Stack flexDirection="row" spacing={2}>
            <Button
              variant="contained"
              color="info"
              onClick={handleDownloadTemplate}
              startIcon={<Iconify icon="eva:file-text-outline" />}
            >
              {t('mileageManagement.downloadTemplate')}
            </Button>

            {courses && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownloadCourses}
                startIcon={<Iconify icon="eva:download-outline" />}
              >
                {t('mileageManagement.downloadCourseExcel')}
              </Button>
            )}
          </Stack>

          <Alert severity="info">{t('mileageManagement.courseListDescription')}</Alert>

          {loading ? (
            <Skeleton variant="rounded" height={TABLE_HEIGHT} />
          ) : (
            <>
              {courses && courses.length > 0 ? (
                <TableContainer
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    height: TABLE_HEIGHT,
                    overflow: 'auto',
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('mileageManagement.courseTable.code')}</TableCell>
                        <TableCell>{t('mileageManagement.courseTable.name')}</TableCell>
                        <TableCell>{t('mileageManagement.courseTable.credit')}</TableCell>
                        <TableCell>{t('mileageManagement.courseTable.isPBL')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {courses.map((course, index) => (
                        <TableRow key={index}>
                          <TableCell>{course.code}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.credit}</TableCell>
                          <TableCell>{course.isPBL ? 'O' : 'X'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Stack height={TABLE_HEIGHT} justifyContent="center" alignItems="center">
                  <EmptyContent
                    title={t('mileageManagement.noCoursesFound')}
                    description={t('mileageManagement.noCoursesFoundDescription')}
                  />
                </Stack>
              )}
            </>
          )}

          <ExcelUploadSection file={file} setFile={setFile} onClickExcelUpload={handleFileUpload} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
