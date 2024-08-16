'use client';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { Card, Stack, Button, Skeleton, Container, Typography } from '@mui/material';

import { useYearSemesterSelector } from 'src/hooks/use-year-semester-selector';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { Activity } from 'src/domain/activity/activity';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import Iconify from 'src/components/iconify';

import AreaSelector from './area-selector';
import ActivityTable from './activity-table';
import AddActivityModal from './add-activity-modal';
import UserMileageOverview from './user-mileage-overview';
import YearSemesterSelector from '../mileage-management/year-semester-selector';

export default function MileageScholarshipApplicationView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { year, semester, yearOptions, setYear, setSemester } = useYearSemesterSelector();
  const userId = user?.uid;
  const universityCode = user?.university;
  const [areas, setAreas] = useState<MileageArea[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mileageLoading, setMileageLoading] = useState<boolean>(true);
  const [activityLoading, setActivityLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [selectedAreaIndex, setSelectedAreaIndex] = useState<number>(0);

  const fetchAreas = async () => {
    setMileageLoading(true);
    try {
      const response = await axios.get('/api/mileage', {
        params: { universityCode, year, semester },
      });
      setAreas(response.data.areas || []);
    } catch (error) {
      enqueueSnackbar('마일리지 데이터를 불러오는 중 오류가 발생했습니다.', {
        variant: 'error',
      });
    } finally {
      setMileageLoading(false);
    }
  };

  const fetchActivities = async () => {
    setActivityLoading(true);
    try {
      const response = await axios.get('/api/activities', {
        params: { userId, year, semester },
      });
      setActivities(response.data.activities || []);
    } catch (error) {
      enqueueSnackbar('활동 데이터를 불러오는 중 오류가 발생했습니다.', {
        variant: 'error',
      });
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityCode, year, semester]);

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, year, semester]);

  const handleAddActivity = async (activity: Activity) => {
    try {
      await axios.post('/api/activities', {
        userId,
        year,
        semester,
        activity,
      });

      enqueueSnackbar('활동이 성공적으로 추가되었습니다.', { variant: 'success' });
      fetchActivities();
    } catch (error) {
      enqueueSnackbar('활동 추가 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleDeleteClick = async (id: string) => {
    const activity = activities.find((activityItem) => activityItem.id === id);
    if (!activity) return;

    if (window.confirm('해당 항목을 삭제하시겠습니까?')) {
      try {
        await axios.delete('/api/activities', {
          data: {
            userId,
            year,
            semester,
            activity,
          },
        });

        enqueueSnackbar('활동이 성공적으로 삭제되었습니다.', { variant: 'success' });
        fetchActivities();
      } catch (error) {
        enqueueSnackbar('활동 삭제 중 오류가 발생했습니다.', { variant: 'error' });
      }
    }
  };

  const handleAreaChange = (event: React.MouseEvent<HTMLElement>, newIndex: number) => {
    if (newIndex !== null) {
      setSelectedAreaIndex(newIndex);
    }
  };

  const currentArea = areas[selectedAreaIndex];
  const filteredActivities = activities.filter((activity) => activity.area === currentArea?.name);

  const columns = currentArea
    ? [
        ...currentArea.fields.map((field) => ({
          field: field.name,
          type: field.type === 'date' ? 'string' : field.type,
          // DB에 type date가 string으로 저장되어 있기 때문에 윗줄이 없으면 오류 발생
          headerName: field.name,
          flex: 1,
          minWidth: 100,
          headerAlign: field.type === 'boolean' ? 'center' : 'left',
          align: field.type === 'boolean' ? 'center' : 'left',
          // 미관상 type이 boolean인 경우만 center로 설정, 나머지는 left로 설정
        })),
        {
          field: 'actions',
          type: 'actions',
          headerName: '삭제',
          flex: 1,
          width: 72,
        },
      ]
    : [];

  return (
    <Container>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h4">{t('nav.mileageScholarshipApplication')}</Typography>

        <YearSemesterSelector
          year={year}
          semester={semester}
          setYear={setYear}
          setSemester={setSemester}
          yearOptions={yearOptions}
          size="small"
        />
      </Stack>

      {mileageLoading ? (
        <Stack flexDirection="row" justifyContent="space-between">
          <Skeleton variant="rounded" width={360} height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" width={120} height={56} sx={{ borderRadius: 1 }} />
        </Stack>
      ) : (
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <AreaSelector
            areas={areas}
            selectedAreaIndex={selectedAreaIndex}
            handleAreaChange={handleAreaChange}
          />

          <Stack flexDirection="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              size="large"
              startIcon={<Iconify icon="eva:plus-outline" />}
            >
              활동 추가
            </Button>

            <UserMileageOverview
              activities={activities}
              areas={areas}
              year={year}
              semester={semester}
              disabled={activities.length === 0}
            />
          </Stack>
        </Stack>
      )}

      <Stack sx={{ height: 24 }} />

      <Card sx={{ height: 560 }}>
        <ActivityTable
          filteredActivities={filteredActivities}
          columns={columns}
          activityLoading={activityLoading}
          handleDeleteClick={handleDeleteClick}
        />
      </Card>

      {currentArea && (
        <AddActivityModal
          open={open}
          onClose={() => setOpen(false)}
          area={currentArea}
          onAddActivity={handleAddActivity}
          universityCode={universityCode}
          year={year}
          semester={semester}
          yearOptions={yearOptions}
        />
      )}
    </Container>
  );
}
