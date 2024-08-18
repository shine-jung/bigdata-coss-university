import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';
import { MDProcess } from 'src/domain/md-process/md-process';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const semester = searchParams.get('semester');
  const universityCode = searchParams.get('universityCode');

  if (!year || !semester || !universityCode) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const docRef = doc(DB, `md-process/${universityCode}/${year}/${semester}`);
    const processDoc = await getDoc(docRef);
    if (!processDoc.exists()) {
      return NextResponse.json({ error: '과정 정보를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ processes: processDoc.data()?.processes || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: '과정 정보를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { year, semester, universityCode, process } = await request.json();

  if (!year || !semester || !universityCode || !process) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const docRef = doc(DB, `md-process/${universityCode}/${year}/${semester}`);
    const processDoc = await getDoc(docRef);

    let updatedProcesses = [];

    if (processDoc.exists()) {
      const existingData = processDoc.data();
      updatedProcesses = existingData.processes || [];
    }

    updatedProcesses.push(process);

    await setDoc(docRef, { processes: updatedProcesses });

    return NextResponse.json({ message: '과정이 성공적으로 저장되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '과정 추가 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { year, semester, universityCode, process } = await request.json();

  if (!year || !semester || !universityCode || !process) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const docRef = doc(DB, `md-process/${universityCode}/${year}/${semester}`);
    const processDoc = await getDoc(docRef);

    if (!processDoc.exists()) {
      return NextResponse.json({ error: '과정 정보를 찾을 수 없습니다' }, { status: 404 });
    }

    const existingData = processDoc.data();
    const updatedProcesses = existingData.processes.map((p: MDProcess) => {
      if (p.id === process.id) {
        return process;
      }
      return p;
    });

    await setDoc(docRef, { processes: updatedProcesses });

    return NextResponse.json({ message: '과정이 성공적으로 수정되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '과정 수정 중 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { year, semester, universityCode, processId } = await request.json();

  if (!year || !semester || !universityCode || !processId) {
    return NextResponse.json({ error: '필드가 부족합니다' }, { status: 400 });
  }

  try {
    const docRef = doc(DB, `md-process/${universityCode}/${year}/${semester}`);
    const processDoc = await getDoc(docRef);

    if (!processDoc.exists()) {
      return NextResponse.json({ error: '과정 정보를 찾을 수 없습니다' }, { status: 404 });
    }

    const existingData = processDoc.data();
    const updatedProcesses = existingData.processes.filter((p: MDProcess) => p.id !== processId);

    await setDoc(docRef, { processes: updatedProcesses });

    return NextResponse.json({ message: '과정이 성공적으로 삭제되었습니다' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '과정 삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}
