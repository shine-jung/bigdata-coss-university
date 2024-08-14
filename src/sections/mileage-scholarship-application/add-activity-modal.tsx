import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { Activity } from 'src/domain/activity/activity';
import { Course } from 'src/domain/mileage-management/course';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import { DynamicForm } from './dynamic-form';
import { CourseCompletionForm } from './course-completion-form';

interface AddActivityModalProps {
  area: MileageArea;
  open: boolean;
  onClose: () => void;
  onAddActivity: (activity: Activity) => void;
  universityCode: string;
  year: string;
  semester: string;
  yearOptions: string[];
}

const AddActivityModal = ({
  area,
  open,
  onClose,
  onAddActivity,
  universityCode,
  year,
  semester,
  yearOptions,
}: AddActivityModalProps) => {
  const methods = useForm();
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const [courses, setCourses] = useState<Course[]>([]);
  const [subjectType, setSubjectType] = useState(1);

  useEffect(() => {
    if (area.isCourseCompletion) {
      const fetchCourses = async () => {
        try {
          const response = await axios.get('/api/courses', {
            params: { universityCode, year, semester },
          });
          setCourses(response.data.courses || []);
        } catch (error) {
          console.error('Failed to fetch courses:', error);
        }
      };

      fetchCourses();
    }
  }, [area, semester, universityCode, year]);

  const onSubmit = (data: any) => {
    if (area) {
      const processedData = Object.keys(data).reduce(
        (acc, key) => {
          if (data[key] === 'true' || data[key] === 'false') {
            acc[key] = data[key] === 'true';
          } else {
            acc[key] = data[key];
          }
          return acc;
        },
        {} as { [key: string]: any }
      );

      // PBL 교과목 이수의 경우 35점, 그 외 활동은 각 영역별 기본 점수로 설정
      const points = processedData['PBL여부'] === true ? 35 : area.defaultPoints;

      onAddActivity({
        id: uuidv4(),
        area: area.name,
        data: processedData,
        points,
      });

      reset();
      onClose();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectType(+event.target.value);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>[{area.name}] 활동 추가</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          {area.isCourseCompletion ? (
            <CourseCompletionForm
              subjectType={subjectType}
              courses={courses}
              errors={errors}
              year={year}
              yearOptions={yearOptions}
              handleChange={handleChange}
              setValue={setValue}
            />
          ) : (
            <DynamicForm area={area} />
          )}
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          취소
        </Button>
        <Button variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)}>
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivityModal;
