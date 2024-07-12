import { NextRequest, NextResponse } from 'next/server';
import {
  doc,
  query,
  addDoc,
  getDocs,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { Notice } from 'src/domain/notice/notice';
import { DB } from 'src/auth/context/firebase/lib';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const universityCode = searchParams.get('universityCode');

  if (!universityCode) {
    return NextResponse.json({ error: '대학 코드가 필요합니다' }, { status: 400 });
  }

  try {
    const noticesCollection = collection(DB, `notices_${universityCode}`);
    const noticesQuery = query(noticesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(noticesQuery);

    const notices: Notice[] = querySnapshot.docs.map((document) => {
      const data = document.data();
      return {
        id: document.id,
        title: data.title,
        content: data.content,
        author: data.author,
        createdAt: data.createdAt,
      };
    });

    return NextResponse.json(notices, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '공지사항을 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

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
      createdAt: serverTimestamp(),
    });

    return NextResponse.json(
      { id: docRef.id, message: '공지사항이 성공적으로 추가되었습니다' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: '공지사항 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { id, universityCode, title, content, author } = await request.json();

  if (!id || !universityCode || !title || !content || !author) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const noticeRef = doc(DB, `notices_${universityCode}`, id);
    await updateDoc(noticeRef, {
      title,
      content,
      author,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ message: '공지사항이 성공적으로 수정되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '공지사항 수정 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const universityCode = searchParams.get('universityCode');

  if (!id || !universityCode) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const noticeRef = doc(DB, `notices_${universityCode}`, id);
    await deleteDoc(noticeRef);

    return NextResponse.json({ message: '공지사항이 성공적으로 삭제되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '공지사항 삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}
