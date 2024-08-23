import React from 'react';

import {
  Stack,
  Table,
  Dialog,
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { StudentInfo } from 'src/domain/student/student-info';
import { MDApplication } from 'src/domain/application/md-application';
import { STUDENT_INFO_TABLE_HEAD } from 'src/domain/student/student-info-table-head';

interface ApplicationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  application: MDApplication | null;
}

const MDApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  open,
  onClose,
  application,
}) => {
  const { t } = useTranslate();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {t('mdApplication.applicationDetails', {
          studentNumber: application?.studentInfo.studentNumber,
          studentName: application?.studentInfo.name,
        })}
      </DialogTitle>
      <DialogContent dividers>
        {application && (
          <Stack spacing={3}>
            {application.studentInfo && (
              <Stack>
                <Typography variant="subtitle1" gutterBottom>
                  {t('mdApplication.studentInformation')}
                </Typography>
                <TableContainer
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {STUDENT_INFO_TABLE_HEAD.map((head) => (
                          <TableCell key={head.key} align="center">
                            {head.key}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {STUDENT_INFO_TABLE_HEAD.map((head) => (
                          <TableCell key={head.key} align="center">
                            {application.studentInfo?.[head.value as keyof StudentInfo]}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            )}

            {application.processNames && (
              <Stack>
                <Typography variant="subtitle1" gutterBottom>
                  {t('mdApplication.applicationProcess')}
                </Typography>

                <Typography gutterBottom>{application.processNames}</Typography>
              </Stack>
            )}

            <Stack>
              <Typography variant="subtitle1" gutterBottom>
                {t('mdApplication.subjectInformation')}
              </Typography>

              <TableContainer
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t('mdApplication.subject.number')}</TableCell>
                      <TableCell align="center">{t('mdApplication.subject.type')}</TableCell>
                      <TableCell align="center">{t('mdApplication.subject.code')}</TableCell>
                      <TableCell align="center">{t('mdApplication.subject.name')}</TableCell>
                      <TableCell align="center">{t('mdApplication.subject.credit')}</TableCell>
                      <TableCell align="center">{t('mdApplication.subject.department')}</TableCell>
                      <TableCell align="center">{t('mdApplication.subject.required')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {application.subjects.length > 0 ? (
                      application.subjects.map((subject, index) => (
                        <TableRow key={subject.id}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{subject.type}</TableCell>
                          <TableCell align="center">{subject.code}</TableCell>
                          <TableCell align="center">{subject.name}</TableCell>
                          <TableCell align="center">{subject.credit}</TableCell>
                          <TableCell align="center">{subject.department}</TableCell>
                          <TableCell align="center">
                            {subject.required
                              ? t('mdApplication.required')
                              : t('mdApplication.optional')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          {t('mdApplication.noSubjectsFound')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MDApplicationDetailsDialog;
