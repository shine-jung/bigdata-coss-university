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
    const docRef = doc(DB, `md-category/${universityCode}/${year}/${semester}`);
    const categoryDoc = await getDoc(docRef);
    if (!categoryDoc.exists()) {
      return NextResponse.json({ categories: [] }, { status: 200 });
    }

    return NextResponse.json({ categories: categoryDoc.data()?.categories || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '과목 분류를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { universityCode, year, semester, categories } = await request.json();

  if (!year || !semester || !universityCode || !categories || !Array.isArray(categories)) {
    return NextResponse.json({ error: '필드가 부족하거나 잘못된 형식입니다' }, { status: 400 });
  }

  try {
    const docRef = doc(DB, `md-category/${universityCode}/${year}/${semester}`);

    await setDoc(docRef, { categories }, { merge: true });

    return NextResponse.json({ message: '과목 분류가 성공적으로 저장되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '과목 분류 저장 중 오류가 발생했습니다' }, { status: 500 });
  }
}
