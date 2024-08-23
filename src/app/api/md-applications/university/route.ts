import { NextRequest, NextResponse } from 'next/server';
import { getDocs, collection } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const universityCode = searchParams.get('universityCode');
  const year = searchParams.get('year');
  const semester = searchParams.get('semester');

  if (!universityCode || !year || !semester) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const applicationsRef = collection(DB, `md-applications_${universityCode}/${year}/${semester}`);
    const applicationsSnapshot = await getDocs(applicationsRef);

    const applications = applicationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '신청 목록을 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
