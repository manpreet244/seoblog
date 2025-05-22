// This component is used to protect routes that should only be accessed by authenticated users
import {useEffect} from 'react';
import Router from 'next/router';
import { isAuth } from '../../actions/auth';

const Private = ({ children }) => {
  useEffect(() => {
    if (!isAuth()) {
      Router.push('/signin');
    }
  }, []);

  return <>{children}</>;
}

export default Private;