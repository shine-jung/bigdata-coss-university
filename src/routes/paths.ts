// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  MAIN: '/main',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // MAIN
  main: {
    root: ROOTS.MAIN,
    notice: `${ROOTS.MAIN}/notice`,
    formDownload: `${ROOTS.MAIN}/form-download`,
    adminManagement: `${ROOTS.MAIN}/admin-management`,
    schoolManagement: `${ROOTS.MAIN}/school-management`,
    noticeCreation: `${ROOTS.MAIN}/notice-creation`,
    formDownloadCreation: `${ROOTS.MAIN}/form-download-creation`,
    popupNoticeManagement: `${ROOTS.MAIN}/popup-notice-management`,
    mileageScholarshipApplicationList: `${ROOTS.MAIN}/mileage-scholarship-application-list`,
    mileageManagement: `${ROOTS.MAIN}/mileage-management`,
    MDCompletionApplicationList: `${ROOTS.MAIN}/md-completion-application-list`,
    MDCourseManagement: `${ROOTS.MAIN}/md-course-management`,
    mileageScholarshipApplication: `${ROOTS.MAIN}/mileage-scholarship-application`,
    mileageScholarshipApplicationHistory: `${ROOTS.MAIN}/mileage-scholarship-application-history`,
    MDCompletionApplication: `${ROOTS.MAIN}/md-completion-application`,
    MDCompletionApplicationHistory: `${ROOTS.MAIN}/md-completion-application-history`,
    studentRecordManagement: `${ROOTS.MAIN}/student-record-management`,
  },
};
