import { NextRequest, NextResponse } from 'next/server';
import { addDoc, Timestamp, collection } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';

export async function POST(request: NextRequest) {
  const { universityCode, title, content, author } = await request.json();

  if (!universityCode || !title || !content || !author) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(DB, `notices_${universityCode}`), {
      title,
      content,
      author,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json(
      { id: docRef.id, message: '공지사항이 성공적으로 추가되었습니다' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: '공지사항 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}
