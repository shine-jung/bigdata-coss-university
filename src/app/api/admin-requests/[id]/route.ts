import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

import { DB } from 'src/auth/context/firebase/lib';

// 관리자 권한 요청 승인/거부
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminId, adminName } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    const requestRef = doc(DB, 'adminRequests', id);
    const requestDoc = await getDoc(requestRef);

    if (!requestDoc.exists()) {
      return NextResponse.json(
        { error: '요청을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await updateDoc(requestRef, {
      status,
      processedBy: adminId || null,
      processedByName: adminName || null,
      processedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // 승인된 경우 사용자의 role을 admin으로 업데이트
    if (status === 'approved') {
      const requestData = requestDoc.data();
      const userRef = doc(DB, 'users', requestData.userId);
      
      await updateDoc(userRef, {
        role: 'admin',
        updatedAt: Timestamp.now(),
      });
    }

    return NextResponse.json({
      success: true,
      message: status === 'approved' 
        ? '관리자 권한이 승인되었습니다.' 
        : '관리자 권한 요청이 거부되었습니다.',
    });
  } catch (error) {
    console.error('Admin request update error:', error);
    return NextResponse.json(
      { error: '요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 관리자 권한 요청 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const requestRef = doc(DB, 'adminRequests', id);
    
    const requestDoc = await getDoc(requestRef);
    if (!requestDoc.exists()) {
      return NextResponse.json(
        { error: '요청을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await deleteDoc(requestRef);

    return NextResponse.json({
      success: true,
      message: '요청이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Admin request delete error:', error);
    return NextResponse.json(
      { error: '요청 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
