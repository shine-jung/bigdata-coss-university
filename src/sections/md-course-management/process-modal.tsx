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

import { useTranslate } from 'src/locales';
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
}) => {
  const { t } = useTranslate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t(`mdProcess.process.${process.id ? 'edit' : 'add'}`)}</DialogTitle>
      <DialogContent>
        <Stack>
          <TextField
            label={t('mdProcess.process.name')}
            value={process.name || ''}
            onChange={(e) => setProcess((prev) => ({ ...prev, name: e.target.value }))}
            margin="dense"
          />
          <TextField
            label={t('mdProcess.process.minStandardCourses')}
            type="number"
            value={process.minStandardCourses || ''}
            onChange={(e) =>
              setProcess((prev) => ({ ...prev, minStandardCourses: parseInt(e.target.value, 10) }))
            }
            margin="dense"
          />
          <TextField
            label={t('mdProcess.process.minLinkedCourses')}
            type="number"
            value={process.minLinkedCourses || ''}
            onChange={(e) =>
              setProcess((prev) => ({ ...prev, minLinkedCourses: parseInt(e.target.value, 10) }))
            }
            margin="dense"
          />
          <TextField
            label={t('mdProcess.process.minRequiredCredits')}
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
            label={t('mdProcess.process.requiresCompulsoryCourses')}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
