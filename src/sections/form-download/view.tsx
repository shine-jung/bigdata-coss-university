'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Form } from 'src/domain/form/form';
import { useAuthContext } from 'src/auth/hooks';

import FormList from './list';
import FormDetail from './detail';

// ----------------------------------------------------------------------

export default function FormView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  const fetchForms = async () => {
    if (user?.university) {
      try {
        const response = await axios.get<Form[]>(`/api/forms`, {
          params: { universityCode: user.university },
        });
        const formsData = response.data.map((form) => ({
          ...form,
          createdAt: new Timestamp(form.createdAt.seconds, form.createdAt.nanoseconds),
        }));
        setForms(formsData);
      } catch (error) {
        console.error('양식을 가져오는 중 오류가 발생했습니다', error);
      }
    }
  };

  useEffect(() => {
    fetchForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        {t('nav.formDownload')}
      </Typography>

      {selectedForm ? (
        <FormDetail
          form={selectedForm}
          onBack={() => setSelectedForm(null)}
          refetchForms={fetchForms}
        />
      ) : (
        <FormList forms={forms} onSelectForm={setSelectedForm} />
      )}
    </Container>
  );
}
