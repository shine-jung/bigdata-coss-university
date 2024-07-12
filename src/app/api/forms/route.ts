import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

import { Form } from 'src/domain/form/form';
import { DB, STORAGE } from 'src/auth/context/firebase/lib';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const universityCode = searchParams.get('universityCode');

  if (!universityCode) {
    return NextResponse.json({ error: '대학 코드가 필요합니다' }, { status: 400 });
  }

  try {
    const formsCollection = collection(DB, `forms_${universityCode}`);
    const formsQuery = query(formsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(formsQuery);

    const forms: Form[] = querySnapshot.docs.map((document) => {
      const data = document.data();
      return {
        id: document.id,
        title: data.title,
        content: data.content,
        author: data.author,
        downloadURL: data.downloadURL,
        fileName: data.fileName,
        createdAt: data.createdAt,
      };
    });

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '양식을 가져오는 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { universityCode, title, content, author, file, fileName } = await request.json();

  if (!universityCode || !title || !content || !author || !file || !fileName) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(file, 'base64');
    const fileRef = ref(STORAGE, `forms/${universityCode}/${fileName}`);
    const snapshot = await uploadBytes(fileRef, fileBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const docRef = await addDoc(collection(DB, `forms_${universityCode}`), {
      title,
      content,
      author,
      downloadURL,
      fileName,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json(
      { id: docRef.id, message: '양식이 성공적으로 추가되었습니다' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: '양식 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { id, universityCode, title, content, author, file, fileName } = await request.json();

  if (!id || !universityCode || !title || !author) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    let downloadURL;
    if (file) {
      const fileBuffer = Buffer.from(file, 'base64');
      const fileRef = ref(STORAGE, `forms/${universityCode}/${fileName}`);
      const snapshot = await uploadBytes(fileRef, fileBuffer);
      downloadURL = await getDownloadURL(snapshot.ref);
    }

    const formRef = doc(DB, `forms_${universityCode}`, id);
    await updateDoc(formRef, {
      title,
      content,
      author,
      ...(file && { downloadURL, fileName }),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ message: '양식이 성공적으로 수정되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '양식 수정 중 오류가 발생했습니다' }, { status: 500 });
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
    const formRef = doc(DB, `forms_${universityCode}`, id);
    await deleteDoc(formRef);

    return NextResponse.json({ message: '양식이 성공적으로 삭제되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '양식 삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}
