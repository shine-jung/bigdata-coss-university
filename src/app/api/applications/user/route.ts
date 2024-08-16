import { doc, getDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { DB } from 'src/auth/context/firebase/lib';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const universityCode = searchParams.get('universityCode');
  const year = searchParams.get('year');
  const semester = searchParams.get('semester');

  if (!userId || !universityCode || !year || !semester) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const applicationRef = doc(DB, `applications_${universityCode}/${year}/${semester}/${userId}`);
    const applicationDoc = await getDoc(applicationRef);

    if (!applicationDoc.exists()) {
      return NextResponse.json({ error: '신청 정보를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(applicationDoc.data(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '신청 정보를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
