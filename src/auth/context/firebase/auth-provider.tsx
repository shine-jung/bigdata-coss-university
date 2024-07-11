'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';
import { doc, getDoc, setDoc, Timestamp, collection } from 'firebase/firestore';
import {
  signOut,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { DB, firebaseApp } from './lib';
import { AuthContext } from './auth-context';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const AUTH = getAuth(firebaseApp);

enum Types {
  INITIAL = 'INITIAL',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: Action) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(() => {
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          if (user.emailVerified) {
            const userProfile = doc(DB, 'users', user.uid);

            const docSnap = await getDoc(userProfile);

            const profile = docSnap.data();

            dispatch({
              type: Types.INITIAL,
              payload: {
                user: {
                  ...user,
                  ...profile,
                  id: user.uid,
                },
              },
            });
          } else {
            dispatch({
              type: Types.INITIAL,
              payload: {
                user: null,
              },
            });
            await signOut(AUTH);
            alert('이메일 인증을 완료해주세요.\nPlease verify your email.');
          }
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(AUTH, email, password);
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      university: string,
      role: string,
      studentNumber: string | undefined,
      department: string | undefined,
      major: string | undefined,
      grade: string | undefined,
      semester: string | undefined
    ) => {
      const newUser = await createUserWithEmailAndPassword(AUTH, email, password);

      await sendEmailVerification(newUser.user);

      const userProfile = doc(collection(DB, 'users'), newUser.user?.uid);

      await setDoc(userProfile, {
        uid: newUser.user?.uid,
        email,
        displayName: name,
        university,
        role,
        studentNumber,
        department,
        major,
        grade,
        semester,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    await signOut(AUTH);
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(AUTH, email);
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user?.emailVerified ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      isAdmin: state.user?.role === 'admin',
      method: 'firebase',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      logout,
      register,
      forgotPassword,
    }),
    [
      status,
      state.user,
      //
      login,
      logout,
      register,
      forgotPassword,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
