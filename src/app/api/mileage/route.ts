import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
    const mileageDoc = await getDoc(doc(DB, `mileage/${universityCode}/${year}/${semester}`));
    if (!mileageDoc.exists()) {
      return NextResponse.json({ error: '마일리지 정보를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(mileageDoc.data(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '마일리지 정보를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { universityCode, year, semester, areas } = await request.json();

  if (!universityCode || !year || !semester || !areas) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const mileageRef = doc(DB, `mileage/${universityCode}/${year}/${semester}`);
    await setDoc(mileageRef, { areas });

    return NextResponse.json(
      { message: '마일리지 정보가 성공적으로 추가되었습니다' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '마일리지 정보 추가 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
