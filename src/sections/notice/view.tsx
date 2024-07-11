'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { Notice } from 'src/domain/notice/notice';

import NoticeList from './list';
import NoticeDetail from './detail';

// ----------------------------------------------------------------------

export default function NoticeView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const fetchNotices = async () => {
    if (user?.university) {
      try {
        const response = await axios.get<Notice[]>(`/api/notices`, {
          params: { universityCode: user.university },
        });
        const noticesData = response.data.map((notice) => ({
          ...notice,
          createdAt: new Timestamp(notice.createdAt.seconds, notice.createdAt.nanoseconds),
        }));
        setNotices(noticesData);
      } catch (error) {
        console.error('공지사항을 가져오는 중 오류가 발생했습니다', error);
      }
    }
  };

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        {t('nav.notice')}
      </Typography>

      {selectedNotice ? (
        <NoticeDetail
          notice={selectedNotice}
          onBack={() => setSelectedNotice(null)}
          refetchNotices={fetchNotices}
        />
      ) : (
        <NoticeList notices={notices} onSelectNotice={setSelectedNotice} />
      )}
    </Container>
  );
}
