import React from 'react';

import { Table, TableRow, TableHead, TableCell, TableBody, TableContainer } from '@mui/material';

import { Subject } from 'src/domain/md-process/subject';

interface SubjectTableProps {
  subjects: Subject[];
}

export const SubjectTable: React.FC<SubjectTableProps> = ({ subjects }) => (
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
          <TableCell>과목명</TableCell>
          <TableCell>과목코드</TableCell>
          <TableCell>학점</TableCell>
          <TableCell>개설학부</TableCell>
          <TableCell>필수 여부</TableCell>
          <TableCell>과목 분류 연번</TableCell>
          <TableCell>과정 ID</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {subjects.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} align="center">
              데이터가 없습니다.
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
