import React from 'react';

import { Table, TableRow, TableHead, TableCell, TableBody, TableContainer } from '@mui/material';

import { useTranslate } from 'src/locales';
import { SubjectCategory } from 'src/domain/md-process/subject-category';

interface CategoryTableProps {
  categories: SubjectCategory[];
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  const { t } = useTranslate();

  return (
    <TableContainer
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        maxHeight: 500,
        overflow: 'auto',
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('mdProcess.category.number')}</TableCell>
            <TableCell>{t('mdProcess.category.type')}</TableCell>
            <TableCell>{t('mdProcess.category.code')}</TableCell>
            <TableCell>{t('mdProcess.category.name')}</TableCell>
            <TableCell>{t('mdProcess.category.processId')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                {t('common.noData')}
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.number}</TableCell>
                <TableCell>{category.type}</TableCell>
                <TableCell>{category.code}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.processId}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
