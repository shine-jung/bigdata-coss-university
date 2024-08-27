import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

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

// ----------------------------------------------------------------------

export function useNavData(isAdmin: boolean) {
  const { t } = useTranslate();

  const boardData = useMemo(
    () => ({
      subheader: t('nav.board'),
      items: [
        {
          title: t('nav.notice'),
          path: paths.main.notice,
          icon: ICONS.notice,
        },
        {
          title: t('nav.formDownload'),
          path: paths.main.formDownload,
          icon: ICONS.fileDownload,
        },
      ],
    }),
    [t]
  );

  const data = useMemo(
    () => [
      boardData,
      ...(isAdmin
        ? [
            {
              subheader: t('nav.admin'),
              items: [
                // TODO(seokmin): Uncomment the following code
                // {
                //   title: t('nav.adminAccountManagement'),
                //   path: paths.main.adminManagement,
                //   icon: ICONS.admin,
                // },
                // {
                //   title: t('nav.schoolManagement'),
                //   path: paths.main.schoolManagement,
                //   icon: ICONS.school,
                // },
                {
                  title: t('nav.noticeCreation'),
                  path: paths.main.noticeCreation,
                  icon: ICONS.write,
                },
                {
                  title: t('nav.formUpload'),
                  path: paths.main.formUpload,
                  icon: ICONS.fileUpload,
                },
                {
                  title: t('nav.popupNoticeManagement'),
                  path: paths.main.popupNoticeManagement,
                  icon: ICONS.popup,
                },
                {
                  title: t('nav.mileageScholarshipApplicationList'),
                  path: paths.main.mileageScholarshipApplicationList,
                  icon: ICONS.scholarship,
                },
                {
                  title: t('nav.mileageManagement'),
                  path: paths.main.mileageManagement,
                  icon: ICONS.settings,
                },
                {
                  title: t('nav.MDCompletionApplicationList'),
                  path: paths.main.MDCompletionApplicationList,
                  icon: ICONS.degree,
                },
                {
                  title: t('nav.MDCourseManagement'),
                  path: paths.main.MDCourseManagement,
                  icon: ICONS.settings,
                },
              ],
            },
          ]
        : [
            {
              subheader: t('nav.mileageScholarship'),
              items: [
                {
                  title: t('nav.mileageScholarshipApplication'),
                  path: paths.main.mileageScholarshipApplication,
                  icon: ICONS.write,
                },
                {
                  title: t('nav.mileageScholarshipApplicationHistory'),
                  path: paths.main.mileageScholarshipApplicationHistory,
                  icon: ICONS.scholarship,
                },
              ],
            },
            {
              subheader: t('nav.MDCompletion'),
              items: [
                {
                  title: t('nav.MDCompletionApplication'),
                  path: paths.main.MDCompletionApplication,
                  icon: ICONS.write,
                },
                {
                  title: t('nav.MDCompletionApplicationHistory'),
                  path: paths.main.MDCompletionApplicationHistory,
                  icon: ICONS.degree,
                },
              ],
            },
            // TODO(seokmin): Uncomment the following code
            // {
            //   subheader: t('nav.studentRecordManagement'),
            //   items: [
            //     {
            //       title: t('nav.studentRecordManagement'),
            //       path: paths.main.studentRecordManagement,
            //       icon: ICONS.user,
            //     },
            //   ],
            // },
          ]),
    ],
    [isAdmin, t, boardData]
  );

  return data;
}
