import { NextRequest, NextResponse } from 'next/server';
import { query, where, getDocs, collection } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const universityCode = searchParams.get('universityCode');

  if (!universityCode) {
    return NextResponse.json(
      { error: '필드가 부족합니다 (universityCode가 필요합니다)' },
      { status: 400 }
    );
  }

  try {
    const studentsRef = collection(DB, 'users');
    const q = query(
      studentsRef,
      where('university', '==', universityCode),
      where('role', '==', 'user')
    );

    const querySnapshot = await getDocs(q);

    const students = querySnapshot.docs.map((doc) => doc.data());

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: '학생 목록을 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
