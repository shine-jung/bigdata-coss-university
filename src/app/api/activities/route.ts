import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';
import { Activity } from 'src/domain/activity/activity';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const year = searchParams.get('year');
  const semester = searchParams.get('semester');

  if (!userId || !year || !semester) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const activityRef = doc(DB, `activities/${userId}/${year}/${semester}`);
    const activitiesDoc = await getDoc(activityRef);

    if (!activitiesDoc.exists()) {
      return NextResponse.json({ activities: [] }, { status: 200 });
    }

    return NextResponse.json(activitiesDoc.data(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '활동 정보를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const {
    userId,
    year,
    semester,
    activity,
  }: { userId: string; year: string; semester: string; activity: Activity } = await request.json();

  if (!userId || !year || !semester || !activity) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const activitiesRef = doc(DB, `activities/${userId}/${year}/${semester}`);
    const activitiesDoc = await getDoc(activitiesRef);

    if (!activitiesDoc.exists()) {
      await setDoc(activitiesRef, { activities: [activity] });
    } else {
      await updateDoc(activitiesRef, {
        activities: arrayUnion(activity),
      });
    }

    return NextResponse.json({ message: '활동이 성공적으로 추가되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '활동 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const {
    userId,
    year,
    semester,
    activity,
  }: { userId: string; year: string; semester: string; activity: Activity } = await request.json();

  if (!userId || !year || !semester || !activity) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const activitiesRef = doc(DB, `activities/${userId}/${year}/${semester}`);
    const activitiesDoc = await getDoc(activitiesRef);

    if (!activitiesDoc.exists()) {
      return NextResponse.json({ error: '해당 사용자의 활동 정보가 없습니다' }, { status: 404 });
    }

    await updateDoc(activitiesRef, {
      activities: arrayRemove(activity),
    });

    return NextResponse.json({ message: '활동이 성공적으로 삭제되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '활동 삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}
