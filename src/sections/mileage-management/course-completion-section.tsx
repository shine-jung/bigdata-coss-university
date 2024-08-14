import axios from 'axios';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Stack, Button, Switch, Typography, InputLabel } from '@mui/material';

import { useTranslate } from 'src/locales';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import CourseCompletionAlert from './course-completion-alert';
import ManageCourseListModal from './manage-course-list-modal';
import { COURSE_COMPLETION_AREA } from './constants/preset-areas';

interface CourseCompletionSectionProps {
  isCourseCompletionActive: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchAreas: () => void;
  areas: MileageArea[] | null;
  universityCode: string;
  year: string;
  semester: string;
}

export default function CourseCompletionSection({
  isCourseCompletionActive,
  setIsModalOpen,
  fetchAreas,
  areas,
  universityCode,
  year,
  semester,
}: CourseCompletionSectionProps) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const [isCourseListModalOpen, setIsCourseListModalOpen] = useState(false);

  const toggleCourseCompletion = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isActive = event.target.checked;

    let updatedAreas: MileageArea[] | null = null;

    if (isActive) {
      updatedAreas = areas ? [COURSE_COMPLETION_AREA, ...areas] : [COURSE_COMPLETION_AREA];
    } else {
      updatedAreas = areas?.filter((area) => !area.isCourseCompletion) || null;
    }

    try {
      await axios.post('/api/mileage', {
        universityCode,
        year,
        semester,
        areas: updatedAreas,
      });

      fetchAreas();
      enqueueSnackbar(
        t('mileageManagement.toggleCourseCompletionSuccess', {
          status: isActive ? t('mileageManagement.activated') : t('mileageManagement.deactivated'),
        }),
        { variant: 'success' }
      );
    } catch (error) {
      enqueueSnackbar(t('mileageManagement.toggleError'), { variant: 'error' });
    }
  };

  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        {t('mileageManagement.courseCompletion')}
      </Typography>

      <CourseCompletionAlert />

      <Stack flexDirection="row" alignItems="center" mt={1}>
        <Stack flexDirection="row" alignItems="center">
          <InputLabel>{t('mileageManagement.courseCompletionToggle')}</InputLabel>
          <Switch
            checked={isCourseCompletionActive}
            onChange={toggleCourseCompletion}
            name="courseCompletionToggle"
            color="primary"
          />
        </Stack>

        <Stack flexDirection="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => setIsModalOpen(true)}
            disabled={!isCourseCompletionActive}
          >
            {t('mileageManagement.editCourseCompletionName')}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsCourseListModalOpen(true)}
            disabled={!isCourseCompletionActive}
          >
            {t('mileageManagement.manageCourseList')}
          </Button>
        </Stack>
      </Stack>

      <ManageCourseListModal
        open={isCourseListModalOpen}
        onClose={() => setIsCourseListModalOpen(false)}
        universityCode={universityCode}
        year={year}
        semester={semester}
      />
    </Stack>
  );
}
