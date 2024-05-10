import { FirebaseVerifyView } from 'src/sections/auth/firebase';

// ----------------------------------------------------------------------

export const metadata = {
  title: '이메일 확인',
};

export default function VerifyPage() {
  return <FirebaseVerifyView />;
}
