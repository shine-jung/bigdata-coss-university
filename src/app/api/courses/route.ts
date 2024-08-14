import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';

export async function POST(request: NextRequest) {
  const { universityCode, year, semester, courses } = await request.json();

  if (!universityCode || !year || !semester || !courses) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const courseRef = doc(DB, `courses/${universityCode}/${year}/${semester}`);
    await setDoc(courseRef, { courses });

    return NextResponse.json(
      { message: '교과목 목록이 성공적으로 추가되었습니다' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: '교과목 목록 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const universityCode = searchParams.get('universityCode');
  const year = searchParams.get('year');
  const semester = searchParams.get('semester');

  if (!universityCode || !year || !semester) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const courseDoc = await getDoc(doc(DB, `courses/${universityCode}/${year}/${semester}`));
    if (!courseDoc.exists()) {
      return NextResponse.json({ error: '교과목 목록을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(courseDoc.data(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '교과목 목록을 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
