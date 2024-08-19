import React from 'react';
import { useSnackbar } from 'notistack';

import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { MDProcess } from 'src/domain/md-process/md-process';

import Iconify from 'src/components/iconify';

interface ProcessTableProps {
  processes: MDProcess[];
  onEdit: (process: MDProcess) => void;
  onDelete: (processId: string) => void;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({ processes, onEdit, onDelete }) => {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const onClickProcessIdCell = (processId: string) => {
    navigator.clipboard.writeText(processId);
    enqueueSnackbar(t('mdProcess.process.copySuccess'), { variant: 'success' });
  };

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
          <TableRow sx={{ whiteSpace: 'pre-line' }}>
            <TableCell>{t('mdProcess.process.id')}</TableCell>
            <TableCell>{t('mdProcess.process.name')}</TableCell>
            <TableCell>{t('mdProcess.process.minStandardCourses')}</TableCell>
            <TableCell>{t('mdProcess.process.minLinkedCourses')}</TableCell>
            <TableCell>{t('mdProcess.process.minCompulsoryCourses')}</TableCell>
            <TableCell>{t('mdProcess.process.minOptionalCourses')}</TableCell>
            <TableCell>{t('mdProcess.process.minRequiredCredits')}</TableCell>
            <TableCell>{t('mdProcess.process.requiresCompulsoryCourses')}</TableCell>
            <TableCell align="center">{t('common.edit')}</TableCell>
            <TableCell align="center">{t('common.delete')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                {t('common.noData')}
              </TableCell>
            </TableRow>
          ) : (
            processes.map((process) => (
              <TableRow key={process.id}>
                <TableCell
                  onClick={() => onClickProcessIdCell(process.id)}
                  sx={{
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 150,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {process.id}
                </TableCell>
                <TableCell>{process.name}</TableCell>
                <TableCell>{process.minStandardCourses}</TableCell>
                <TableCell>{process.minLinkedCourses}</TableCell>
                <TableCell>{process.minCompulsoryCourses}</TableCell>
                <TableCell>{process.minOptionalCourses}</TableCell>
                <TableCell>{process.minRequiredCredits}</TableCell>
                <TableCell>{process.requiresCompulsoryCourses ? 'O' : 'X'}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(process)}>
                    <Iconify icon="mdi:pencil" />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onDelete(process.id)}>
                    <Iconify icon="mdi:trash-can" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
