import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import { PopupNotice } from 'src/domain/popup-notice/popup-notice';

export const useFetchPopupNotice = (universityCode?: string) => {
  const [popupNotice, setPopupNotice] = useState<PopupNotice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopupNotice = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/popup-notice?universityCode=${universityCode}`);
      setPopupNotice(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [universityCode]);

  useEffect(() => {
    if (universityCode) {
      fetchPopupNotice();
    }
  }, [universityCode, fetchPopupNotice]);

  return { popupNotice, loading, error, refetch: fetchPopupNotice };
};
