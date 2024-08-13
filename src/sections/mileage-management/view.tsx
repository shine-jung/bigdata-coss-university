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
      <Stack spacing={3}>
        <Stack flexDirection="row" spacing={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>년도</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)} label="년도">
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}년
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>학기</InputLabel>
            <Select value={semester} onChange={(e) => setSemester(e.target.value)} label="학기">
              <MenuItem value="1">1학기</MenuItem>
              <MenuItem value="2">2학기</MenuItem>
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
                    <Typography variant="h4">{area.name} 영역</Typography>
                    <Typography variant="body2" gutterBottom>
                      항목 당 기본 점수: {area.defaultPoints}점
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
                            <TableCell>필드 이름</TableCell>
                            <TableCell>필드 타입</TableCell>
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
                엑셀 선택
                <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileChange} />
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={onClickExcelUpload}
                startIcon={<Iconify icon="eva:upload-fill" />}
                disabled={!file}
              >
                엑셀 업로드
              </Button>

              {file && <Typography variant="subtitle2">{file.name}</Typography>}
            </Stack>

            <Alert severity="info">
              {areas && areas.length > 0
                ? `새로운 엑셀 파일을 업로드하면 ${year}년 ${semester}학기의 마일리지 영역이 업데이트됩니다.`
                : `업로드할 엑셀 파일을 선택하고 '엑셀 업로드' 버튼을 눌러주세요.`}
            </Alert>
          </>
        )}
      </Stack>
    </Container>
  );
}
