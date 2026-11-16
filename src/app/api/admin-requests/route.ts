import { NextRequest, NextResponse } from 'next/server';
import { query, addDoc, getDocs, orderBy, Timestamp, collection } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';

// 관리자 권한 요청 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userEmail, university, message } = body;

    if (!userId || !userName || !userEmail || !university) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const adminRequestsRef = collection(DB, 'adminRequests');
    
    const docRef = await addDoc(adminRequestsRef, {
      userId,
      userName,
      userEmail,
      university,
      message: message || '',
      status: 'pending', // pending, approved, rejected
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      requestId: docRef.id,
      message: '관리자 권한 요청이 성공적으로 전송되었습니다.',
    });
  } catch (error) {
    console.error('Admin request creation error:', error);
    return NextResponse.json(
      { error: '관리자 권한 요청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 관리자 권한 요청 목록 조회
export async function GET() {
  try {
    const adminRequestsRef = collection(DB, 'adminRequests');
    const q = query(adminRequestsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('Admin requests fetch error:', error);
    return NextResponse.json(
      { error: '관리자 권한 요청 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
