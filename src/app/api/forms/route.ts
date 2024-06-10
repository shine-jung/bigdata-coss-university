import { NextRequest, NextResponse } from 'next/server';
import { addDoc, Timestamp, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { DB, STORAGE } from 'src/auth/context/firebase/lib';

export async function POST(request: NextRequest) {
  const { universityCode, title, author, file } = await request.json();

  if (!universityCode || !title || !author || !file) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(file, 'base64');
    const fileRef = ref(STORAGE, `forms/${universityCode}/${title}`);
    const snapshot = await uploadBytes(fileRef, fileBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const docRef = await addDoc(collection(DB, `forms_${universityCode}`), {
      title,
      author,
      downloadURL,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json(
      { id: docRef.id, message: '양식이 성공적으로 추가되었습니다' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: '양식 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}
