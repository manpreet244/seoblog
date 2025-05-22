//Protected route for admin users

import {useEffect} from 'react';
import Router from 'next/router';
import { isAuth } from '../../actions/auth';

const Private = ({ children }) => {
  useEffect(() => {
    if (!isAuth()) {
      Router.push('/signin');
    }else if (isAuth().role !== 1){
        Router.push('/')
    }
  }, []);

  return <>{children}</>;
}

export default Private;