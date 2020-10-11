import React, { createContext, useEffect, useState } from 'react';

import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase';
import 'firebase/auth';

export const AppContext = createContext(null);

const firebaseConfig = {
  apiKey: 'AIzaSyD3vbZ-CI6Yg_uOBfkVgsT45qvRdYkuwCE',
  authDomain: 'user-app-9c08c.firebaseapp.com',
  databaseURL: 'https://user-app-9c08c.firebaseio.com',
  projectId: 'user-app-9c08c',
  storageBucket: 'user-app-9c08c.appspot.com',
  messagingSenderId: '668590509492',
  appId: '1:668590509492:web:79db1d41da393f4a75b6e1',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
  const [appUser, setAppUser] = useState({});
  const [message, setMessage] = useState('');

  const handleSignOut = () => {
    signOut();
    setAppUser({});
    setMessage('');
  };

  useEffect(() => {
    if (user) {
      fetch(`/users`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
    }
  }, [user]);
  return (
    <AppContext.Provider
      value={{ appUser, signInWithGoogle, handleSignOut, message }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(AppProvider);
