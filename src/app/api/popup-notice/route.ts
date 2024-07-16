import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

import { DB, STORAGE } from 'src/auth/context/firebase/lib';

const COLLECTION_NAME = 'popupNotices';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const universityCode = searchParams.get('universityCode');

  if (!universityCode) {
    return NextResponse.json({ error: '대학 코드가 필요합니다' }, { status: 400 });
  }

  try {
    const docRef = doc(DB, COLLECTION_NAME, universityCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const isBeforeExpiry = new Date(data.expiryDate) >= new Date();
      return NextResponse.json(isBeforeExpiry ? data : null, { status: 200 });
    }
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('팝업 공지를 가져오는 중 오류가 발생했습니다:', error);
    return NextResponse.json(
      { error: '팝업 공지를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { universityCode, title, image, expiryDate } = await request.json();

    if (!universityCode || !title || !image || !expiryDate) {
      return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(image, 'base64');
    const fileRef = ref(STORAGE, `popupNotices/${universityCode}`);
    const snapshot = await uploadBytes(fileRef, fileBuffer);
    const imageUrl = await getDownloadURL(snapshot.ref);

    const docRef = doc(DB, COLLECTION_NAME, universityCode);
    await setDoc(docRef, {
      title,
      imageUrl,
      expiryDate,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ message: '팝업 공지가 성공적으로 추가되었습니다' }, { status: 200 });
  } catch (error) {
    console.error('팝업 공지 추가 중 오류가 발생했습니다:', error);
    return NextResponse.json({ error: '팝업 공지 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}
