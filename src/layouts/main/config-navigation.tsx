import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => <Iconify icon={`solar:${name}`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  notice: icon('pin-bold-duotone'),
  fileDownload: icon('file-download-bold-duotone'),
  write: icon('document-add-bold-duotone'),
  scholarship: icon('medal-ribbons-star-bold-duotone'),
  degree: icon('diploma-bold-duotone'),
  user: icon('user-id-bold-duotone'),
  admin: icon('shield-user-bold-duotone'),
  school: icon('square-academic-cap-bold-duotone'),
  fileUpload: icon('file-send-bold-duotone'),
  popup: icon('window-frame-bold-duotone'),
  settings: icon('widget-add-bold-duotone'),
};

const boardData = {
  subheader: '게시판',
  items: [
    {
      title: '공지사항',
      path: paths.main.notice,
      icon: ICONS.notice,
    },
    {
      title: '양식 다운로드',
      path: paths.main.formDownload,
      icon: ICONS.fileDownload,
    },
  ],
};

// ----------------------------------------------------------------------

export function useNavData(currentRole?: string) {
  const isAdmin = currentRole === 'admin';

  const data = useMemo(
    () => [
      boardData,
      ...(isAdmin
        ? [
            {
              subheader: '관리자',
              items: [
                {
                  title: '관리자 계정 관리',
                  path: paths.main.adminManagement,
                  icon: ICONS.admin,
                },
                {
                  title: '학교 관리',
                  path: paths.main.schoolManagement,
                  icon: ICONS.school,
                },
                {
                  title: '공지사항 작성',
                  path: paths.main.noticeCreation,
                  icon: ICONS.write,
                },
                {
                  title: '양식 업로드',
                  path: paths.main.formDownloadCreation,
                  icon: ICONS.fileUpload,
                },
                {
                  title: '팝업 공지 관리',
                  path: paths.main.popupNoticeManagement,
                  icon: ICONS.popup,
                },
                {
                  title: '마일리지 장학금 신청 목록',
                  path: paths.main.mileageScholarshipApplicationList,
                  icon: ICONS.scholarship,
                },
                {
                  title: '마일리지 항목 관리',
                  path: paths.main.mileageManagement,
                  icon: ICONS.settings,
                },
                {
                  title: 'MD 이수 신청 목록',
                  path: paths.main.MDCompletionApplicationList,
                  icon: ICONS.degree,
                },
                {
                  title: 'MD 과정 관리',
                  path: paths.main.MDCourseManagement,
                  icon: ICONS.settings,
                },
              ],
            },
          ]
        : [
            {
              subheader: '마일리지 장학금',
              items: [
                {
                  title: '마일리지 장학금 신청',
                  path: paths.main.mileageScholarshipApplication,
                  icon: ICONS.write,
                },
                {
                  title: '마일리지 장학금 신청 내역',
                  path: paths.main.mileageScholarshipApplicationHistory,
                  icon: ICONS.scholarship,
                },
              ],
            },
            {
              subheader: '마이크로디그리(MD) 이수',
              items: [
                {
                  title: 'MD 이수 신청',
                  path: paths.main.MDCompletionApplication,
                  icon: ICONS.write,
                },
                {
                  title: 'MD 이수 신청 내역',
                  path: paths.main.MDCompletionApplicationHistory,
                  icon: ICONS.degree,
                },
              ],
            },
            {
              subheader: '학적 관리',
              items: [
                {
                  title: '학적 관리',
                  path: paths.main.studentRecordManagement,
                  icon: ICONS.user,
                },
              ],
            },
          ]),
    ],
    [isAdmin]
  );

  return data;
}
