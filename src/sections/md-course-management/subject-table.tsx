import React from 'react';

import { Table, TableRow, TableHead, TableCell, TableBody, TableContainer } from '@mui/material';

import { useTranslate } from 'src/locales';
import { Subject } from 'src/domain/md-process/subject';

interface SubjectTableProps {
  subjects: Subject[];
}

export const SubjectTable: React.FC<SubjectTableProps> = ({ subjects }) => {
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
            <TableCell>{t('mdProcess.subject.name')}</TableCell>
            <TableCell>{t('mdProcess.subject.code')}</TableCell>
            <TableCell>{t('mdProcess.subject.credit')}</TableCell>
            <TableCell>{t('mdProcess.subject.department')}</TableCell>
            <TableCell>{t('mdProcess.subject.required')}</TableCell>
            <TableCell>{t('mdProcess.subject.categoryNumber')}</TableCell>
            <TableCell>{t('mdProcess.subject.processId')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {t('common.noData')}
              </TableCell>
            </TableRow>
          ) : (
            subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.code}</TableCell>
                <TableCell>{subject.credit}</TableCell>
                <TableCell>{subject.department}</TableCell>
                <TableCell>{subject.required ? 'O' : 'X'}</TableCell>
                <TableCell>{subject.categoryNumber}</TableCell>
                <TableCell>{subject.processId}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
