'use client';

import axios from 'axios';
import { Trans } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import {
  Table,
  Stack,
  Alert,
  Select,
  Button,
  MenuItem,
  TableRow,
  Skeleton,
  TableBody,
  TableCell,
  TableHead,
  InputLabel,
  Typography,
  FormControl,
  TableContainer,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import Iconify from 'src/components/iconify';

import ExcelDownloadButton from './excel-download-button';
import { handleExcelFileUpload } from './utils/excel-utils';

// ----------------------------------------------------------------------

export default function MileageManagementView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const defaultYear = currentMonth === 1 || currentMonth === 2 ? currentYear - 1 : currentYear;
  const defaultSemester = currentMonth >= 3 && currentMonth <= 8 ? '1' : '2';

  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(defaultYear.toString());
  const [semester, setSemester] = useState(defaultSemester);
  const [file, setFile] = useState<File | null>(null);
  const [areas, setAreas] = useState<MileageArea[] | null>(null);
  const universityCode = user?.university;

  const yearOptions = [];
  // eslint-disable-next-line no-plusplus
  for (let y = 2024; y <= currentYear; y++) {
    yearOptions.push(y.toString());
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFile(files[0]);
      e.target.value = '';
    }
  };

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

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        {t('nav.mileageManagement')}
      </Typography>

      <Stack spacing={3}>
        <Stack flexDirection="row" spacing={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('mileageManagement.year')}</InputLabel>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              label={t('mileageManagement.year')}
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>
                  {t('mileageManagement.yearOption', { year: y })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>{t('mileageManagement.semester')}</InputLabel>
            <Select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              label={t('mileageManagement.semester')}
            >
              <MenuItem value="1">
                {t('mileageManagement.semesterOption', { semester: '1' })}
              </MenuItem>
              <MenuItem value="2">
                {t('mileageManagement.semesterOption', { semester: '2' })}
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {loading ? (
          <Skeleton variant="rounded" height={500} />
        ) : (
          <>
            <Stack flexDirection="row" spacing={2}>
              <ExcelDownloadButton />

              {areas && <ExcelDownloadButton mileageAreas={areas} />}
            </Stack>

            <Alert severity="info">
              <Typography variant="body1" gutterBottom>
                {t('mileageManagement.alert.title')}
              </Typography>
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
              <Typography variant="body1" gutterBottom>
                <Trans
                  i18nKey="mileageManagement.alert.additionalInfo.modifyScores"
                  components={{ strong: <strong /> }}
                />
              </Typography>
              <Typography variant="body1" gutterBottom>
                <Trans
                  i18nKey="mileageManagement.alert.additionalInfo.dataAggregationWarning"
                  components={{ strong: <strong /> }}
                />
              </Typography>
            </Alert>

            {areas && areas.length > 0 && (
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
            )}

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
    </Container>
  );
}
