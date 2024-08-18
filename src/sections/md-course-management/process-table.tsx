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

import { MDProcess } from 'src/domain/md-process/md-process';

import Iconify from 'src/components/iconify';

interface ProcessTableProps {
  processes: MDProcess[];
  onEdit: (process: MDProcess) => void;
  onDelete: (processId: string) => void;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({ processes, onEdit, onDelete }) => {
  const { enqueueSnackbar } = useSnackbar();
  const onClickProcessIdCell = (processId: string) => {
    navigator.clipboard.writeText(processId);
    enqueueSnackbar('과정 ID가 복사되었습니다.', { variant: 'success' });
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
            <TableCell>과정 ID</TableCell>
            <TableCell>과정 이름</TableCell>
            <TableCell>표준교과목{'\n'}최소 이수 과목 수</TableCell>
            <TableCell>연계융합교과목{'\n'}최소 이수 과목 수</TableCell>
            <TableCell>최소 이수 학점</TableCell>
            <TableCell>필수 교과목 이수 필요 여부</TableCell>
            <TableCell align="center">수정</TableCell>
            <TableCell align="center">삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                데이터가 없습니다.
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
                    maxWidth: 200,
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
