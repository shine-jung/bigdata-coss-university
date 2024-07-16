import { useState, useEffect } from 'react';

import { Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { useTranslate } from 'src/locales';

import Image from 'src/components/image';

// ----------------------------------------------------------------------

interface PopupNoticeProps {
  title: string;
  imageUrl: string;
  expiryDate: string;
}

export default function PopupNotice({ title, imageUrl, expiryDate }: PopupNoticeProps) {
  const { t } = useTranslate();
  const { state, update } = useLocalStorage('hidePopup', {});

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const shouldShowPopup = !state[today];

    setOpen(shouldShowPopup);
  }, [state, expiryDate]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleHideForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    update(today, true);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{imageUrl && <Image src={imageUrl} alt="Popup Notice" />}</DialogContent>
      <DialogActions>
        <Button onClick={handleHideForToday}>{t('popupNotice.hideForToday')}</Button>
        <Button onClick={handleClose}>{t('popupNotice.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
