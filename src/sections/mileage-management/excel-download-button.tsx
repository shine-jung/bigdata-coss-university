/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
import * as XLSX from 'xlsx';

import { Button } from '@mui/material';

import { useTranslate } from 'src/locales';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import Iconify from 'src/components/iconify';

import { OTHER_AREAS } from './constants/preset-areas';

interface ExcelDownloadButtonProps {
  mileageAreas?: MileageArea[];
}

const ExcelDownloadButton = ({ mileageAreas }: ExcelDownloadButtonProps) => {
  const { t } = useTranslate();

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'FFFFE0' } },
    };
    // TODO(seokmin): headerStyle is not working. Need to fix this.

    const areas = (mileageAreas || OTHER_AREAS).filter((area) => !area.isCourseCompletion);

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

  const buttonLabel = mileageAreas
    ? t('mileageManagement.downloadExcel')
    : t('mileageManagement.downloadTemplate');
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
