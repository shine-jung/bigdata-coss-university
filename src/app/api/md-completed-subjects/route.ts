import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';
import { Subject } from 'src/domain/md-process/subject';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const year = searchParams.get('year');
  const semester = searchParams.get('semester');

  if (!userId || !year || !semester) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const subjectsRef = doc(DB, `md-completed-subjects/${userId}/${year}/${semester}`);
    const subjectsDoc = await getDoc(subjectsRef);

    if (!subjectsDoc.exists()) {
      return NextResponse.json({ subjects: [] }, { status: 200 });
    }

    return NextResponse.json(subjectsDoc.data(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '과목 정보를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const {
    userId,
    year,
    semester,
    subject,
  }: { userId: string; year: string; semester: string; subject: Subject } = await request.json();

  if (!userId || !year || !semester || !subject) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const subjectsRef = doc(DB, `md-completed-subjects/${userId}/${year}/${semester}`);
    const subjectsDoc = await getDoc(subjectsRef);

    if (!subjectsDoc.exists()) {
      await setDoc(subjectsRef, { subjects: [subject] });
    } else {
      await updateDoc(subjectsRef, {
        subjects: arrayUnion(subject),
      });
    }

    return NextResponse.json({ message: '과목이 성공적으로 추가되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '과목 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const {
    userId,
    year,
    semester,
    subject,
  }: { userId: string; year: string; semester: string; subject: Subject } = await request.json();

  if (!userId || !year || !semester || !subject) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const subjectsRef = doc(DB, `md-completed-subjects/${userId}/${year}/${semester}`);
    const subjectsDoc = await getDoc(subjectsRef);

    if (!subjectsDoc.exists()) {
      return NextResponse.json({ error: '해당 사용자의 과목 정보가 없습니다' }, { status: 404 });
    }

    await updateDoc(subjectsRef, {
      subjects: arrayRemove(subject),
    });

    return NextResponse.json({ message: '과목이 성공적으로 삭제되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '과목 삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}
