import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import {
  Radio,
  Button,
  Dialog,
  FormLabel,
  IconButton,
  RadioGroup,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from '@mui/material';

import { Subject } from 'src/domain/md-process/subject';
import { SubjectCategory } from 'src/domain/md-process/subject-category';

import Iconify from 'src/components/iconify';

interface AddSubjectModalProps {
  processId: string;
  category: SubjectCategory;
  subjects: Subject[];
  completedSubjects: Subject[];
  isAdded: boolean;
  addSubject: (subject: Subject) => void;
}

export default function AddSubjectModal({
  processId,
  category,
  subjects,
  completedSubjects,
  isAdded,
  addSubject,
}: AddSubjectModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSubjectId(event.target.value);
  };

  const handleAddSubject = () => {
    if (!selectedSubjectId) {
      enqueueSnackbar('과목을 선택해주세요.', { variant: 'warning' });
      return;
    }

    const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId);

    if (!selectedSubject) {
      enqueueSnackbar('선택한 과목을 찾을 수 없습니다.', { variant: 'error' });
      return;
    }

    if (
      completedSubjects.some((completedSubject) => completedSubject.code === selectedSubject.code)
    ) {
      enqueueSnackbar('다른 과정에 추가되어 있는 과목입니다.', { variant: 'error' });
      return;
    }

    const updatedSubject = {
      ...selectedSubject,
      name: selectedSubject.name || category.name,
      type: category.type,
    };

    addSubject(updatedSubject);
    handleClose();
  };

  const filteredSubjects = subjects.filter(
    (subject) => subject.processId === processId && subject.categoryNumber === category.number
  );

  return (
    <>
      <IconButton size="small" onClick={handleOpen} disabled={isAdded}>
        <Iconify icon="eva:plus-circle-fill" fontSize="small" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h6" component="h2">
          과목 추가
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <FormLabel>과목을 선택해주세요.</FormLabel>
          <RadioGroup value={selectedSubjectId} onChange={handleChange}>
            {filteredSubjects.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                해당 과정에 등록된 과목이 없습니다.
              </Typography>
            ) : (
              filteredSubjects.map((subject) => (
                <FormControlLabel
                  key={subject.id}
                  value={subject.id}
                  control={<Radio color="success" />}
                  label={`[${subject.code}] ${subject.name || category.name}`}
                />
              ))
            )}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleAddSubject}
            color="success"
            disabled={!selectedSubjectId}
          >
            추가
          </Button>
          <Button variant="contained" onClick={handleClose} color="error">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
