import { doc, setDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { DB } from 'src/auth/context/firebase/lib';

export async function POST(request: NextRequest) {
  const { universityCode, userId, year, semester, activities } = await request.json();

  if (!universityCode || !userId || !year || !semester || !activities) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const applicationRef = doc(DB, `applications_${universityCode}/${year}/${semester}/${userId}`);
    await setDoc(applicationRef, { activities });

    return NextResponse.json({ message: '신청이 성공적으로 제출되었습니다' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '신청 제출 중 오류가 발생했습니다' }, { status: 500 });
  }
}
