import React from 'react';
import * as XLSX from 'xlsx';

import { Button } from '@mui/material';

import { useTranslate } from 'src/locales';
import { Subject } from 'src/domain/md-process/subject';
import { SubjectCategory } from 'src/domain/md-process/subject-category';

import Iconify from 'src/components/iconify';

interface ExcelDownloadButtonProps {
  categories?: SubjectCategory[];
  subjects?: Subject[];
}

const ExcelDownloadButton: React.FC<ExcelDownloadButtonProps> = ({ categories, subjects }) => {
  const { t } = useTranslate();
  const hasData = categories || subjects;

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();

    if (categories) {
      const categoryData = categories.map((category) => ({
        number: category.number,
        type: category.type,
        code: category.code,
        name: category.name,
        processId: category.processId,
      }));

      const categoryWorksheet = XLSX.utils.json_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(workbook, categoryWorksheet, 'Categories');
    } else {
      const categoryTemplateData = [
        {
          number: '',
          type: '',
          code: '',
          name: '',
          processId: '',
        },
      ];

      const categoryTemplateSheet = XLSX.utils.json_to_sheet(categoryTemplateData);
      XLSX.utils.book_append_sheet(workbook, categoryTemplateSheet, 'Categories');
    }

    if (subjects) {
      const subjectData = subjects.map((subject) => ({
        name: subject.name,
        code: subject.code,
        credit: subject.credit,
        department: subject.department,
        required: subject.required,
        categoryNumber: subject.categoryNumber,
        processId: subject.processId,
      }));

      const subjectWorksheet = XLSX.utils.json_to_sheet(subjectData);
      XLSX.utils.book_append_sheet(workbook, subjectWorksheet, 'Subjects');
    } else {
      const subjectTemplateData = [
        {
          name: '',
          code: '',
          credit: '',
          department: '',
          required: '',
          categoryNumber: '',
          processId: '',
        },
      ];

      const subjectTemplateSheet = XLSX.utils.json_to_sheet(subjectTemplateData);
      XLSX.utils.book_append_sheet(workbook, subjectTemplateSheet, 'Subjects');
    }

    XLSX.writeFile(workbook, hasData ? 'md-course.xlsx' : 'md-course-template.xlsx');
  };

  const buttonLabel = hasData ? t('mdProcess.downloadExcel') : t('mdProcess.downloadTemplate');
  const buttonColor = hasData ? 'secondary' : 'info';
  const buttonStartIcon = hasData ? 'eva:download-outline' : 'eva:file-text-outline';

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
