import React from 'react';

import {
  Stack,
  Dialog,
  Button,
  Switch,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { MDProcess } from 'src/domain/md-process/md-process';

interface ProcessModalProps {
  open: boolean;
  process: Partial<MDProcess>;
  onClose: () => void;
  onSave: () => void;
  setProcess: React.Dispatch<React.SetStateAction<Partial<MDProcess>>>;
}

export const ProcessModal: React.FC<ProcessModalProps> = ({
  open,
  process,
  onClose,
  onSave,
  setProcess,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>과정 {process.id ? '수정' : '추가'}</DialogTitle>
    <DialogContent>
      <Stack>
        <TextField
          label="과정 이름"
          value={process.name || ''}
          onChange={(e) => setProcess((prev) => ({ ...prev, name: e.target.value }))}
          margin="dense"
        />
        <TextField
          label="최소 표준교과목 이수 과목 수"
          type="number"
          value={process.minStandardCourses || ''}
          onChange={(e) =>
            setProcess((prev) => ({ ...prev, minStandardCourses: parseInt(e.target.value, 10) }))
          }
          margin="dense"
        />
        <TextField
          label="최소 연계융합교과목 이수 과목 수"
          type="number"
          value={process.minLinkedCourses || ''}
          onChange={(e) =>
            setProcess((prev) => ({ ...prev, minLinkedCourses: parseInt(e.target.value, 10) }))
          }
          margin="dense"
        />
        <TextField
          label="최소 이수 학점"
          type="number"
          value={process.minRequiredCredits || ''}
          onChange={(e) =>
            setProcess((prev) => ({ ...prev, minRequiredCredits: parseInt(e.target.value, 10) }))
          }
          margin="dense"
        />
        <FormControlLabel
          control={
            <Switch
              checked={!!process.requiresCompulsoryCourses}
              onChange={() =>
                setProcess((prev) => ({
                  ...prev,
                  requiresCompulsoryCourses: !prev.requiresCompulsoryCourses,
                }))
              }
            />
          }
          label="필수 교과목 이수 필요 여부"
        />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>취소</Button>
      <Button onClick={onSave} variant="contained" color="primary">
        저장
      </Button>
    </DialogActions>
  </Dialog>
);
