'use client';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type AdminRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  university: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  processedBy?: string;
  processedByName?: string;
  processedAt?: string;
};

export default function SuperAdminView() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // 확인 다이얼로그 상태
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | 'delete';
    requestId: string;
    requestData?: AdminRequest;
  }>({
    open: false,
    type: 'approve',
    requestId: '',
    requestData: undefined,
  });

  // 사유 상세보기 다이얼로그 상태
  const [reasonDialog, setReasonDialog] = useState<{
    open: boolean;
    requestData?: AdminRequest;
  }>({
    open: false,
    requestData: undefined,
  });

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/admin-requests');
      const data = await response.json();

      if (data.success) {
        setRequests(data.requests);
      } else {
        enqueueSnackbar('요청 목록을 불러오는데 실패했습니다.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      enqueueSnackbar('요청 목록을 불러오는데 실패했습니다.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // 확인 다이얼로그 열기
  const openConfirmDialog = useCallback(
    (type: 'approve' | 'reject' | 'delete', requestId: string) => {
      const requestData = requests.find(req => req.id === requestId);
      setConfirmDialog({
        open: true,
        type,
        requestId,
        requestData,
      });
    },
    [requests]
  );

  // 확인 다이얼로그 닫기
  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({
      open: false,
      type: 'approve',
      requestId: '',
      requestData: undefined,
    });
  }, []);

  // 상태 변경 처리(수락/거절)
  const handleStatusChangeConfirmed = useCallback(
    async (requestId: string, status: 'approved' | 'rejected') => {
      try {
        const response = await fetch(`/api/admin-requests/${requestId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
            adminId: user?.id,
            adminName: user?.name,
          }),
        });

        const data = await response.json();

        if (data.success) {
          enqueueSnackbar(data.message, { variant: 'success' });
          fetchRequests(); // 목록 새로고침
        } else {
          enqueueSnackbar(data.error || '처리에 실패했습니다.', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error processing request:', error);
        enqueueSnackbar('처리에 실패했습니다.', { variant: 'error' });
      }
    },
    [user, enqueueSnackbar, fetchRequests]
  );

  // 삭제 처리
  const handleDeleteConfirmed = useCallback(
    async (requestId: string) => {
      try {
        const response = await fetch(`/api/admin-requests/${requestId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          enqueueSnackbar('요청이 삭제되었습니다.', { variant: 'success' });
          fetchRequests(); // 목록 새로고침
        } else {
          enqueueSnackbar(data.error || '삭제에 실패했습니다.', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error deleting request:', error);
        enqueueSnackbar('삭제에 실패했습니다.', { variant: 'error' });
      }
    },
    [enqueueSnackbar, fetchRequests]
  );

  // 확인된 작업 실행
  const executeConfirmedAction = useCallback(async () => {
    const { type, requestId } = confirmDialog;

    try {
      if (type === 'delete') {
        await handleDeleteConfirmed(requestId);
      } else {
        await handleStatusChangeConfirmed(requestId, type === 'approve' ? 'approved' : 'rejected');
      }
    } finally {
      closeConfirmDialog();
    }
  }, [confirmDialog, handleDeleteConfirmed, handleStatusChangeConfirmed, closeConfirmDialog]);

  // 승인 버튼 클릭 (다이얼로그 열기)
  const handleApprove = useCallback(
    (requestId: string) => {
      openConfirmDialog('approve', requestId);
    },
    [openConfirmDialog]
  );

  // 거부 버튼 클릭 (다이얼로그 열기)
  const handleReject = useCallback(
    (requestId: string) => {
      openConfirmDialog('reject', requestId);
    },
    [openConfirmDialog]
  );

  // 삭제 버튼 클릭 (다이얼로그 열기)
  const handleDelete = useCallback(
    (requestId: string) => {
      openConfirmDialog('delete', requestId);
    },
    [openConfirmDialog]
  );

  // 사유 상세보기 다이얼로그 열기
  const openReasonDialog = useCallback(
    (requestId: string) => {
      const requestData = requests.find(req => req.id === requestId);
      setReasonDialog({
        open: true,
        requestData,
      });
    },
    [requests]
  );

  // 사유 상세보기 다이얼로그 닫기
  const closeReasonDialog = useCallback(() => {
    setReasonDialog({
      open: false,
      requestData: undefined,
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거부됨';
      default:
        return status;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'userName',
      headerName: '이름',
      width: 150,
    },
    {
      field: 'userEmail',
      headerName: '이메일',
      width: 250,
    },
    {
      field: 'university',
      headerName: '대학교',
      width: 150,
    },
    {
      field: 'message',
      headerName: '권한 요청 사유',
      width: 400,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              flex: 1,
            }}
            title={params.value}
          >
            {params.value || '사유 없음'}
          </Typography>
          {params.value && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => openReasonDialog(params.id as string)}
              sx={{
                minWidth: 'auto',
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
              }}
            >
              자세히
            </Button>
          )}
        </Stack>
      ),
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          color={getStatusColor(params.value) as any}
          sx={{ minWidth: 80 }}
        >
          {getStatusText(params.value)}
        </Button>
      ),
    },
    {
      field: 'createdAt',
      headerName: '요청일시',
      width: 180,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleString('ko-KR');
      },
    },
    {
      field: 'processedByName',
      headerName: '처리자',
      width: 120,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '작업',
      width: 200,
      getActions: (params: GridRowParams) => {
        const actions = [];

        if (params.row.status === 'pending') {
          actions.push(
            <GridActionsCellItem
              key="approve"
              icon={<Iconify icon="eva:checkmark-circle-2-fill" sx={{ width: 32, height: 32 }} />}
              label="승인"
              onClick={() => handleApprove(params.id as string)}
              color="success"
              sx={{
                '& .MuiSvgIcon-root': { fontSize: '2rem' },
                minWidth: 40,
                minHeight: 40,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'success.lighter',
                },
              }}
            />,
            <GridActionsCellItem
              key="reject"
              icon={<Iconify icon="eva:close-circle-fill" sx={{ width: 32, height: 32 }} />}
              label="거부"
              onClick={() => handleReject(params.id as string)}
              color="error"
              sx={{
                '& .MuiSvgIcon-root': { fontSize: '2rem' },
                minWidth: 40,
                minHeight: 40,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'error.lighter',
                },
              }}
            />
          );
        }

        actions.push(
          <GridActionsCellItem
            key="delete"
            icon={<Iconify icon="eva:trash-2-outline" sx={{ width: 32, height: 32 }} />}
            label="삭제"
            onClick={() => handleDelete(params.id as string)}
            color="error"
            sx={{
              '& .MuiSvgIcon-root': { fontSize: '2rem' },
              minWidth: 40,
              minHeight: 40,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'error.lighter',
              },
            }}
          />
        );

        return actions;
      },
    },
  ];

  // 확인 창
  const getDialogContent = () => {
    const { type, requestData } = confirmDialog;

    switch (type) {
      case 'approve':
        return {
          title: '관리자 권한 승인',
          message: `${requestData?.userName}님의 관리자 권한 요청을 승인하시겠습니까?`,
          confirmText: '승인',
          confirmColor: 'success' as const,
        };
      case 'reject':
        return {
          title: '관리자 권한 거부',
          message: `${requestData?.userName}님의 관리자 권한 요청을 거부하시겠습니까?`,
          confirmText: '거부',
          confirmColor: 'error' as const,
        };
      case 'delete':
        return {
          title: '요청 삭제',
          message: `${requestData?.userName}님의 관리자 권한 요청을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
          confirmText: '삭제',
          confirmColor: 'error' as const,
        };
      default:
        return {
          title: '확인',
          message: '작업을 진행하시겠습니까?',
          confirmText: '확인',
          confirmColor: 'primary' as const,
        };
    }
  };

  const renderConfirmDialog = () => {
    const { title, message, confirmText, confirmColor } = getDialogContent();

    return (
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {message}
          </Typography>
          {confirmDialog.requestData && (
            <Stack spacing={1} sx={{ mt: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>이름:</strong> {confirmDialog.requestData.userName}
              </Typography>
              <Typography variant="body2">
                <strong>이메일:</strong> {confirmDialog.requestData.userEmail}
              </Typography>
              <Typography variant="body2">
                <strong>대학교:</strong> {confirmDialog.requestData.university}
              </Typography>
              {confirmDialog.requestData.message && (
                <Typography variant="body2">
                  <strong>권한 요청 사유:</strong> {confirmDialog.requestData.message}
                </Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={executeConfirmedAction}
            color={confirmColor}
            variant="contained"
            autoFocus
          >
            {confirmText}
          </Button>
          <Button onClick={closeConfirmDialog} color="inherit">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // 사유 상세보기 다이얼로그에서 승인/거절 처리
  const handleApproveFromReason = useCallback(() => {
    if (reasonDialog.requestData) {
      closeReasonDialog();
      handleApprove(reasonDialog.requestData.id);
    }
  }, [reasonDialog.requestData, closeReasonDialog, handleApprove]);

  const handleRejectFromReason = useCallback(() => {
    if (reasonDialog.requestData) {
      closeReasonDialog();
      handleReject(reasonDialog.requestData.id);
    }
  }, [reasonDialog.requestData, closeReasonDialog, handleReject]);

  // 사유 상세보기 다이얼로그
  const renderReasonDialog = () => (
    <Dialog
      open={reasonDialog.open}
      onClose={closeReasonDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>권한 요청 사유 상세보기</DialogTitle>
      <DialogContent>
        {reasonDialog.requestData && (
          <Stack spacing={2}>
            <Stack spacing={1} sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>이름:</strong> {reasonDialog.requestData.userName}
              </Typography>
              <Typography variant="body2">
                <strong>이메일:</strong> {reasonDialog.requestData.userEmail}
              </Typography>
              <Typography variant="body2">
                <strong>대학교:</strong> {reasonDialog.requestData.university}
              </Typography>
              <Typography variant="body2">
                <strong>요청일시:</strong> {new Date(reasonDialog.requestData.createdAt).toLocaleString('ko-KR')}
              </Typography>
              <Typography variant="body2">
                <strong>상태:</strong>
                <Button
                  variant="outlined"
                  size="small"
                  color={getStatusColor(reasonDialog.requestData.status) as any}
                  sx={{ ml: 1, minWidth: 80 }}
                >
                  {getStatusText(reasonDialog.requestData.status)}
                </Button>
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                권한 요청 사유
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  minHeight: 100,
                }}
              >
                {reasonDialog.requestData.message || '사유가 입력되지 않았습니다.'}
              </Typography>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {reasonDialog.requestData?.status === 'pending' && (
          <>
            <Button
              onClick={handleApproveFromReason}
              color="success"
              variant="contained"
              startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
            >
              승인
            </Button>
            <Button
              onClick={handleRejectFromReason}
              color="error"
              variant="outlined"
              startIcon={<Iconify icon="eva:close-circle-fill" />}
            >
              거부
            </Button>
          </>
        )}
        <Button onClick={closeReasonDialog} color="inherit">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">관리자 권한 요청 관리</Typography>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:refresh-fill" />}
            onClick={fetchRequests}
          >
            새로고침
          </Button>
        </Stack>

        <Card>
          <DataGrid
            rows={requests}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderColor: 'divider',
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'background.neutral',
              },
            }}
          />
        </Card>
      </Container>

      {/* 확인 다이얼로그 */}
      {renderConfirmDialog()}

      {/* 사유 상세보기 다이얼로그 */}
      {renderReasonDialog()}
    </>
  );
}

