'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

import { Skeleton } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Form } from 'src/domain/form/form';
import { useAuthContext } from 'src/auth/hooks';

import EmptyContent from 'src/components/empty-content';

import FormList from './list';
import FormDetail from './detail';

// ----------------------------------------------------------------------

export default function FormView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

      {loading ? (
        <Skeleton variant="rounded" height={500} />
      ) : (
        <>
          {selectedForm ? (
            <FormDetail
              form={selectedForm}
              onBack={() => setSelectedForm(null)}
              refetchForms={fetchForms}
            />
          ) : (
            <>
              {forms.length === 0 ? (
                <EmptyContent title={t('form.noFormsFound')} />
              ) : (
                <FormList forms={forms} onSelectForm={setSelectedForm} />
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}
