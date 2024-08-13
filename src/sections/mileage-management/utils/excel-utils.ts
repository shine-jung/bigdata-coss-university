import axios from 'axios';
import * as XLSX from 'xlsx';
import { isNaN } from 'lodash';
import { enqueueSnackbar } from 'notistack';

import { Field } from 'src/domain/mileage-management/mileage-area';

export const handleExcelFileUpload = async (
  file: File,
  universityCode: string,
  year: string,
  semester: string,
  fetchAreas: () => void
) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    if (!e.target) {
      enqueueSnackbar('엑셀 파일을 읽을 수 없습니다.', { variant: 'error' });
      return;
    }
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'array' });

    try {
      const json = workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        const allowedTypes = ['string', 'number', 'date', 'boolean'];

        let defaultPoints;
        const fields = [] as Field[];

        rows.forEach((row, index) => {
          if (row[3] === '항목 당 기본 점수') {
            if (typeof row[4] !== 'number' || isNaN(row[4])) {
              throw new Error(`시트 "${sheetName}"에서 항목 당 기본 점수가 올바르지 않습니다.`);
            }
            defaultPoints = row[4];
          } else if (row[0] !== undefined && row[1] !== undefined) {
            if (index === 0 && (row[0] === '필드 이름' || row[0] === '필드 타입')) {
              return;
            }

            if (!allowedTypes.includes(row[1])) {
              throw new Error(
                `시트 "${sheetName}"에서 발견된 유효하지 않은 필드 유형 "${
                  row[1]
                }"입니다. 허용된 유형은 다음과 같습니다: ${allowedTypes.join(', ')}.`
              );
            }
            fields.push({ name: row[0], type: row[1] });
          }
        });

        return {
          name: sheetName,
          defaultPoints,
          fields,
        };
      });

      const response = await axios.post('/api/mileage', {
        universityCode,
        year,
        semester,
        areas: json,
      });

      enqueueSnackbar(response.data.message, { variant: 'success' });
      fetchAreas();
    } catch (error: any) {
      enqueueSnackbar(error.message || '업로드 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };
  reader.readAsArrayBuffer(file);
};
