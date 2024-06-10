'use client';

import { useState, useEffect } from 'react';
import { query, getDocs, orderBy, collection } from 'firebase/firestore';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { Notice } from 'src/domain/notice/notice';
import { DB } from 'src/auth/context/firebase/lib';

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
        const noticesCollection = collection(DB, `notices_${user.university}`);
        const noticesQuery = query(noticesCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(noticesQuery);
        const noticesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            author: data.author,
            createdAt: data.createdAt,
          };
        });

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
        <NoticeDetail notice={selectedNotice} onBack={() => setSelectedNotice(null)} />
      ) : (
        <NoticeList notices={notices} onSelectNotice={setSelectedNotice} />
      )}
    </Container>
  );
}
