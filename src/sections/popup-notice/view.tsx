import { useState, useEffect } from 'react';

import { Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { localStorageGetItem } from 'src/utils/storage-available';

import { useTranslate } from 'src/locales';

import Image from 'src/components/image';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'hide-popup';

interface PopupNoticeProps {
  title: string;
  imageUrl: string;
}

export function PopupNotice({ title, imageUrl }: PopupNoticeProps) {
  const { t } = useTranslate();
  const { update } = useLocalStorage(STORAGE_KEY, {});
  const hidePopupString = localStorageGetItem(STORAGE_KEY, '{}');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hidePopupString) {
      const today = new Date().toISOString().split('T')[0];
      const hidePopupObject = JSON.parse(hidePopupString);
      const shouldShowPopup = !hidePopupObject[today];

      if (shouldShowPopup) {
        setOpen(true);
      }
    }
  }, [hidePopupString]);

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
