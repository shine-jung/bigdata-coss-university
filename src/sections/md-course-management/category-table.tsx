import React from 'react';

import { Table, TableRow, TableHead, TableCell, TableBody, TableContainer } from '@mui/material';

import { SubjectCategory } from 'src/domain/md-process/subject-category';

interface CategoryTableProps {
  categories: SubjectCategory[];
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => (
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
          <TableCell>연번</TableCell>
          <TableCell>구분</TableCell>
          <TableCell>코드</TableCell>
          <TableCell>명칭</TableCell>
          <TableCell>과정 ID</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} align="center">
              데이터가 없습니다.
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
