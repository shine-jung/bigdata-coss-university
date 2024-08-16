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

import { StudentInfo } from 'src/domain/student/student-info';
import { Application } from 'src/domain/application/application';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';
import { STUDENT_INFO_TABLE_HEAD } from 'src/domain/student/student-info-table-head';

interface ApplicationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  application: Application | null;
  areas: MileageArea[];
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  open,
  onClose,
  application,
  areas,
}) => {
  const selectedApplicationTotalPoints = application?.activities.reduce(
    (total: number, activity: any) => total + activity.points,
    0
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        마일리지 장학금 신청 상세 정보 - {application?.studentInfo.studentNumber}{' '}
        {application?.studentInfo.name} (총 {selectedApplicationTotalPoints}점)
      </DialogTitle>
      <DialogContent dividers>
        {application && (
          <Stack spacing={3}>
            {application.studentInfo && (
              <Stack>
                <Typography variant="subtitle1" gutterBottom>
                  학생 정보
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

            {areas.map((area, index) => {
              const filteredActivities =
                application.activities.filter((activity) => activity.area === area.name) || [];
              const totalPoints = filteredActivities.reduce(
                (acc, activity) => acc + activity.points,
                0
              );
              return (
                <Stack key={index}>
                  <Typography variant="subtitle1" gutterBottom>
                    {area.name} 영역 - {totalPoints}점
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
                          <TableCell align="center">점수</TableCell>
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
                              <TableCell align="center">{activity.points}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={area.fields.length + 1} align="center">
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
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
