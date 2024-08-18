import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const semester = searchParams.get('semester');
  const universityCode = searchParams.get('universityCode');

  if (!year || !semester || !universityCode) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const docRef = doc(DB, `md-subject/${universityCode}/${year}/${semester}`);
    const subjectDoc = await getDoc(docRef);
    if (!subjectDoc.exists()) {
      return NextResponse.json({ subjects: [] }, { status: 200 });
    }

    return NextResponse.json({ subjects: subjectDoc.data()?.subjects || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '과목 정보를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { universityCode, year, semester, subjects } = await request.json();

  if (!year || !semester || !universityCode || !subjects || !Array.isArray(subjects)) {
    return NextResponse.json({ error: '필드가 부족하거나 잘못된 형식입니다' }, { status: 400 });
  }

  try {
    const docRef = doc(DB, `md-subject/${universityCode}/${year}/${semester}`);

    await setDoc(docRef, { subjects }, { merge: true });

    return NextResponse.json({ message: '과목이 성공적으로 저장되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '과목 저장 중 오류가 발생했습니다' }, { status: 500 });
  }
}
