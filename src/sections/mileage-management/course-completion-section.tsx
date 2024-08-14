import React from 'react';
import axios from 'axios';

import { Stack, Button, Switch, Typography, InputLabel } from '@mui/material';

import { useTranslate } from 'src/locales';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import CourseCompletionAlert from './course-completion-alert';
import { COURSE_COMPLETION_AREA } from './constants/preset-areas';

interface CourseCompletionSectionProps {
  isCourseCompletionActive: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchAreas: () => void;
  areas: MileageArea[] | null;
  universityCode: string;
  year: string;
  semester: string;
  enqueueSnackbar: (message: string, options?: any) => void;
}

export default function CourseCompletionSection({
  isCourseCompletionActive,
  setIsModalOpen,
  fetchAreas,
  areas,
  universityCode,
  year,
  semester,
  enqueueSnackbar,
}: CourseCompletionSectionProps) {
  const { t } = useTranslate();

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
        <InputLabel>{t('mileageManagement.courseCompletionToggle')}</InputLabel>
        <Switch
          checked={isCourseCompletionActive}
          onChange={toggleCourseCompletion}
          name="courseCompletionToggle"
          color="primary"
        />

        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          disabled={!isCourseCompletionActive}
        >
          {t('mileageManagement.editCourseCompletionName')}
        </Button>
      </Stack>
    </Stack>
  );
}
