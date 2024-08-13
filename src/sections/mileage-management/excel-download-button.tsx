/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
import * as XLSX from 'xlsx';

import { Button } from '@mui/material';

import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import Iconify from 'src/components/iconify';

interface ExcelDownloadButtonProps {
  mileageAreas?: MileageArea[];
}

const ExcelDownloadButton = ({ mileageAreas }: ExcelDownloadButtonProps) => {
  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'FFFFE0' } },
    };
    // TODO(seokmin): headerStyle is not working. Need to fix this.

    const areas = mileageAreas || [
      {
        name: '갈',
        defaultPoints: 10,
        fields: [
          { name: '과목코드', type: 'string' },
          { name: '과목명', type: 'string' },
          { name: '년도', type: 'number' },
          { name: '학기', type: 'number' },
          { name: '담당교수', type: 'string' },
          { name: '이수학점', type: 'number' },
          { name: '성적', type: 'string' },
          { name: 'PBL여부', type: 'boolean' },
          { name: '비고', type: 'string' },
        ],
      },
      {
        name: '매',
        defaultPoints: 20,
        fields: [
          { name: '행사명', type: 'string' },
          { name: '주관대학', type: 'string' },
          { name: '시작일', type: 'date' },
          { name: '종료일', type: 'date' },
          { name: '년도', type: 'number' },
          { name: '학기', type: 'number' },
          { name: '수상내역', type: 'string' },
          { name: '비고', type: 'string' },
        ],
      },
    ];

    areas.forEach((area) => {
      const worksheetData = [
        ...area.fields.map((field) => ({
          '필드 이름': field.name,
          '필드 타입': field.type,
        })),
      ];

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);

      worksheet.D1 = { t: 's', v: '항목 당 기본 점수', s: headerStyle };
      worksheet.E1 = { t: 'n', v: area.defaultPoints };

      const headerCells = ['A1', 'B1', 'C1'];
      headerCells.forEach((cell) => {
        if (!worksheet[cell]) worksheet[cell] = { t: 's', v: '' };
        worksheet[cell].s = headerStyle;
      });

      worksheet['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 5 }, { wch: 20 }];

      const newRange = XLSX.utils.decode_range(worksheet['!ref']!);
      newRange.e.c = Math.max(newRange.e.c, 4);
      newRange.e.r = Math.max(newRange.e.r, 0);
      worksheet['!ref'] = XLSX.utils.encode_range(newRange);

      XLSX.utils.book_append_sheet(workbook, worksheet, area.name);
    });

    XLSX.writeFile(workbook, mileageAreas ? 'mileage-areas.xlsx' : 'mileage-template.xlsx');
  };

  const buttonLabel = mileageAreas ? '현재 마일리지 영역 엑셀 다운로드' : '엑셀 템플릿 다운로드';
  const buttonColor = mileageAreas ? 'secondary' : 'info';
  const buttonStartIcon = mileageAreas ? 'eva:download-outline' : 'eva:file-text-outline';

  return (
    <Button
      variant="contained"
      color={buttonColor}
      onClick={handleDownload}
      startIcon={<Iconify icon={buttonStartIcon} />}
    >
      {buttonLabel}
    </Button>
  );
};

export default ExcelDownloadButton;
