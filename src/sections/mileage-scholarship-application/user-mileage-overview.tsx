import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import {
  Table,
  Stack,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  DialogContentText,
} from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { Activity } from 'src/domain/activity/activity';
import { StudentInfo } from 'src/domain/student/student-info';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import Iconify from 'src/components/iconify';

import generatePDF from './utils/generate-pdf';
import { STUDENT_INFO_TABLE_HEAD } from '../../domain/student/student-info-table-head';

const PDF_SECTION_ID = 'PDF';

interface UserMileageOverviewProps {
  areas: MileageArea[];
  activities: Activity[];
  year: string;
  semester: string;
  disabled?: boolean;
}

export default function UserMileageOverview({
  areas,
  activities,
  year,
  semester,
  disabled,
}: UserMileageOverviewProps) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const studentInfo = user
    ? ({
        studentNumber: user.studentNumber,
        name: user.name,
        department: user.department,
        major: user.major,
        grade: user.grade,
        semester: user.semester,
        email: user.email,
      } as StudentInfo)
    : null;

  const handleApply = async () => {
    if (!studentInfo) {
      alert('User information is not available.');
      return;
    }

    try {
      await axios.post('/api/applications', {
        universityCode: user?.university,
        userId: user?.uid,
        year,
        semester,
        activities,
        studentInfo,
      });
      enqueueSnackbar('Application submitted successfully.', { variant: 'success' });
      handleClose();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Failed to submit application.', { variant: 'error' });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        color="success"
        size="large"
        disabled={disabled}
        startIcon={<Iconify icon="eva:file-text-outline" />}
      >
        마일리지 장학금 신청
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>신청 제출</DialogTitle>

        <DialogContent id={PDF_SECTION_ID}>
          <Stack spacing={3}>
            <Typography variant="h5">
              {year}년 {semester}학기 마일리지 신청서
            </Typography>

            <Stack>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <TableContainer
                sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
              >
                <Table size="small" stickyHeader>
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
                          {studentInfo?.[head.value as keyof StudentInfo]}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>

            {areas.map((area, index) => {
              const filteredActivities = activities.filter(
                (activity) => activity.area === area.name
              );
              return (
                <Stack key={index}>
                  <Typography variant="h6" gutterBottom>
                    {area.name} 영역
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
                          {area.fields.map((field) => (
                            <TableCell key={field.name} align="center">
                              {field.name}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredActivities.length > 0 ? (
                          filteredActivities.map((activity) => (
                            <TableRow key={activity.id}>
                              {area.fields.map((field, fieldIndex) => {
                                if (field.type === 'boolean') {
                                  return (
                                    <TableCell key={fieldIndex} align="center">
                                      {activity.data[field.name] ? 'O' : 'X'}
                                    </TableCell>
                                  );
                                }
                                return (
                                  <TableCell key={fieldIndex} align="center">
                                    {activity.data[field.name]?.toString()}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={area.fields.length} align="center">
                              No activities found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              );
            })}

            <Stack alignItems="flex-end" mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                신청일: {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                신청자: {user?.name} (인)
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="info"
            startIcon={<Iconify icon="bx:bxs-file-pdf" />}
            onClick={() =>
              generatePDF(
                PDF_SECTION_ID,
                `Mileage_Overview_${user?.studentNumber}_${year}_${semester}`
              )
            }
          >
            Download PDF
          </Button>
          <Button variant="contained" color="success" onClick={handleOpenDialog}>
            Apply for Scholarship
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit? You cannot undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApply} color="success" variant="contained">
            Apply
          </Button>
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
