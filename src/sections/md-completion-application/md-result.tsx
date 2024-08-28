import axios from 'axios';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import TableContainer from '@mui/material/TableContainer';
import {
  Table,
  Stack,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { Subject } from 'src/domain/md-process/subject';
import { MDProcess } from 'src/domain/md-process/md-process';
import { StudentInfo } from 'src/domain/student/student-info';

import Iconify from 'src/components/iconify';

interface MDResultProps {
  processes: MDProcess[];
  completedSubjects: Subject[];
  year: string;
  semester: string;
}

interface ProcessStatus {
  isProcessCompleted: boolean;
  totalEarnedCredits: number;
  compulsoryCreditsEarned: number;
  optionalCreditsEarned: number;
  standardCoursesCompleted: number;
  linkedCoursesCompleted: number;
  isCompulsoryCreditsRequirementMet: boolean;
  isOptionalCreditsRequirementMet: boolean;
  isCompulsoryCoursesCompletionMet: boolean;
  isCreditsRequirementMet: boolean;
  isStandardAndLinkedCoursesRequirementMet: boolean;
}

export default function MDResult({ processes, completedSubjects, year, semester }: MDResultProps) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const userId = user?.id;
  const universityCode = user?.university;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const calculateProcessStatus = (process: MDProcess): ProcessStatus => {
    const subjects = completedSubjects.filter((subject) => subject.processId === process.id);

    let compulsoryCreditsEarned = 0;
    let optionalCreditsEarned = 0;
    let totalEarnedCredits = 0;
    const standardCoursesList: string[] = [];
    const linkedCoursesList: string[] = [];
    let isCompulsoryCoursesCompletionMet = !process.requiresCompulsoryCourses;

    subjects.forEach((subject) => {
      if (subject.required) compulsoryCreditsEarned += subject.credit;
      else optionalCreditsEarned += subject.credit;

      totalEarnedCredits += subject.credit;

      if (subject.required) isCompulsoryCoursesCompletionMet = true;
      if (
        process.minStandardCourses > 0 &&
        subject.type === '표준교과목' &&
        !standardCoursesList.includes(subject.code)
      )
        standardCoursesList.push(subject.code);
      if (
        process.minLinkedCourses > 0 &&
        subject.type === '연계융합교과목' &&
        !linkedCoursesList.includes(subject.code)
      )
        linkedCoursesList.push(subject.code);
    });

    const isCompulsoryCreditsRequirementMet = process.minCompulsoryCredits
      ? compulsoryCreditsEarned >= process.minCompulsoryCredits
      : true;
    const isOptionalCreditsRequirementMet = process.minOptionalCredits
      ? optionalCreditsEarned >= process.minOptionalCredits
      : true;
    const isCreditsRequirementMet = totalEarnedCredits >= process.minRequiredCredits;
    const isStandardAndLinkedCoursesRequirementMet =
      standardCoursesList.length >= process.minStandardCourses &&
      linkedCoursesList.length >= process.minLinkedCourses;

    const isProcessCompleted =
      isCompulsoryCreditsRequirementMet &&
      isOptionalCreditsRequirementMet &&
      isCompulsoryCoursesCompletionMet &&
      isCreditsRequirementMet &&
      isStandardAndLinkedCoursesRequirementMet;

    return {
      isProcessCompleted,
      totalEarnedCredits,
      compulsoryCreditsEarned,
      optionalCreditsEarned,
      standardCoursesCompleted: standardCoursesList.length,
      linkedCoursesCompleted: linkedCoursesList.length,
      isCompulsoryCreditsRequirementMet,
      isOptionalCreditsRequirementMet,
      isCompulsoryCoursesCompletionMet,
      isCreditsRequirementMet,
      isStandardAndLinkedCoursesRequirementMet,
    };
  };

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

  const renderRequirement = (
    label: string,
    currentValue: number,
    requiredValue: number,
    isMet: boolean,
    hideValue = false
  ) => (
    <Typography
      variant="body2"
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {label}
      {!hideValue && ` ${currentValue}/${requiredValue}`}
      {isMet ? (
        <Iconify icon="eva:checkmark-fill" color="success.main" />
      ) : (
        <Iconify icon="eva:close-fill" color="text.secondary" />
      )}
    </Typography>
  );

  const handleApply = async (completedProcessNames: string, completedSubjectsList: Subject[]) => {
    if (!studentInfo) {
      enqueueSnackbar(t('mileageApplication.userInformationNotAvailable'), {
        variant: 'error',
      });
      return;
    }

    try {
      await axios.post('/api/md-applications', {
        universityCode,
        userId,
        year,
        semester,
        processNames: completedProcessNames,
        subjects: completedSubjectsList,
        studentInfo,
      });
      enqueueSnackbar(t('mileageApplication.applicationSubmitSuccess'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(t('mileageApplication.applicationSubmitError'), { variant: 'error' });
    }
  };

  const handleApplyClick = async () => {
    const completedProcessNames = processes
      .filter((process) => calculateProcessStatus(process).isProcessCompleted)
      .map((process) => process.name)
      .join(', ');
    if (completedProcessNames === '') {
      enqueueSnackbar('이수한 MD 과정이 없습니다.', { variant: 'error' });
      return;
    }
    if (
      window.confirm(
        `이수 요건을 충족한 과정을 신청하시겠습니까?\n\n이수한 과정: ${completedProcessNames}`
      )
    ) {
      await handleApply(completedProcessNames, completedSubjects);
      handleClose();
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen} color="success">
        MD 이수 여부 확인 및 신청
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>MD 이수 여부 확인</DialogTitle>
        <DialogContent>
          <TableContainer
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              maxHeight: 500,
              overflow: 'auto',
            }}
          >
            <Table size="small">
              <TableBody>
                {processes.map((process) => {
                  const status = calculateProcessStatus(process);
                  return (
                    <TableRow key={process.id}>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {process.name}

                          {status.isProcessCompleted ? (
                            <Iconify icon="eva:checkmark-circle-2-outline" color="success.main" />
                          ) : (
                            <Iconify icon="eva:close-circle-outline" color="text.secondary" />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {process.requiresCompulsoryCourses &&
                          process.minCompulsoryCredits === 0 &&
                          renderRequirement(
                            '필수 교과목 이수',
                            status.isCompulsoryCoursesCompletionMet ? 1 : 0,
                            1,
                            status.isCompulsoryCoursesCompletionMet,
                            true
                          )}
                        {process.minStandardCourses > 0 &&
                          renderRequirement(
                            '표준교과목',
                            status.standardCoursesCompleted,
                            process.minStandardCourses,
                            status.standardCoursesCompleted >= process.minStandardCourses
                          )}
                        {process.minLinkedCourses > 0 &&
                          renderRequirement(
                            '연계융합교과목',
                            status.linkedCoursesCompleted,
                            process.minLinkedCourses,
                            status.linkedCoursesCompleted >= process.minLinkedCourses
                          )}
                        {process.minCompulsoryCredits > 0 &&
                          renderRequirement(
                            '필수교과목 학점',
                            status.compulsoryCreditsEarned,
                            process.minCompulsoryCredits,
                            status.isCompulsoryCreditsRequirementMet
                          )}
                        {process.minOptionalCredits > 0 &&
                          renderRequirement(
                            '선택교과목 학점',
                            status.optionalCreditsEarned,
                            process.minOptionalCredits,
                            status.isOptionalCreditsRequirementMet
                          )}
                        {process.minRequiredCredits > 0 &&
                          renderRequirement(
                            '총 학점',
                            status.totalEarnedCredits,
                            process.minRequiredCredits,
                            status.isCreditsRequirementMet
                          )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleApplyClick} color="success">
            MD 이수 신청
          </Button>
          <Button variant="contained" onClick={handleClose} color="error">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
