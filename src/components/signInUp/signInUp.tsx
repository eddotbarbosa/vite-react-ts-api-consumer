import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import styles from './signInUp.module.scss';
import layout from '../../styles/layout.module.scss';

import api from '../../services/api';

import {useAuth} from '../../hooks/useAuth';

const SignInUp = function () {
  const [current, setCurrent] = useState<'Sign In' | 'Sign Up'>('Sign In');

  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInPassowrd, setSignInPassword] = useState<string>('');

  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpUsername, setSignUpUsername] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');

  const {signIn} = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    signIn(signInEmail, signInPassowrd, () => {
      return navigate('/profile', {replace: true});
    });
  };

  const handleSignUp = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const signUp = await api.post('/users', {
      name: signUpName,
      username: signUpUsername,
      email: signUpEmail,
      password: signUpPassword
    });

    if (!signUp.data.id) return console.log(signUp.data.error);

    setCurrent('Sign In');
  };

  return (
    <div className={`${styles['sign-in-up-container']} ${layout['flex']} ${layout['column']} ${layout['align-center']}`}>
      <div className={`${layout['flex']} ${layout['justify-center']} ${layout['mb-3']} ${layout['mt-6']} ${layout['col-10']}`}>
        <div className={`${layout['mr-6']}`}>
          {current === 'Sign In' ? (
            <button className={`${styles['button-text-sign-in-up']} ${styles['active']}`}>Sign In</button>
          ) : (
            <button className={`${styles['button-text-sign-in-up']}`} onClick={() => {setCurrent(current === 'Sign Up' ? 'Sign In' : 'Sign Up')}}>Sign In</button>
          )}
          <div></div>
        </div>
        <div>
        {current === 'Sign Up' ? (
            <button className={`${styles['button-text-sign-in-up']} ${styles['active']}`}>Sign Up</button>
          ) : (
            <button className={`${styles['button-text-sign-in-up']}`} onClick={() => {setCurrent(current === 'Sign In' ? 'Sign Up' : 'Sign In')}}>Sign Up</button>
          )}
          <div></div>
        </div>
      </div>
      {current === 'Sign In' ? (
        <form className={`${layout['col-10']} ${layout['mb-6']}`} onSubmit={handleSignIn}>
          <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
            <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="sign-in-email">Email Address</label>
            <input className={`${styles['form-field']}`} type="text" name="email" id="sign-in-email"
            value={signInEmail}
            onChange={(event) => {setSignInEmail(event.target.value)}}
            placeholder="Enter your email address..." />
          </div>
          <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
            <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="sign-in-password">Password</label>
            <input className={`${styles['form-field']}`} type="password" name="password" id="sign-in-password"
            value={signInPassowrd}
            onChange={(event) => {setSignInPassword(event.target.value)}}
            placeholder='Enter your password...' />
          </div>
          <input className={`${styles['submit-button']}`} type="submit" value="Sign In" />
        </form>
      ) : (
        <form className={`${layout['col-10']} ${layout['mb-6']}`} onSubmit={handleSignUp}>
          <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
            <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="sign-up-name">Name</label>
            <input className={`${styles['form-field']}`} type="text" name="name" id="sign-up-name"
            value={signUpName}
            onChange={(event) => {setSignUpName(event.target.value)}}
            placeholder="Enter your full name..." />
          </div>
          <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
            <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="sign-up-username">Username</label>
            <input className={`${styles['form-field']}`} type="text" name="username" id="sign-up-username"
            value={signUpUsername}
            onChange={(event) => {setSignUpUsername(event.target.value)}}
            placeholder="Enter your username..." />
          </div>
          <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
            <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="sign-up-email">Email Address</label>
            <input className={`${styles['form-field']}`} type="text" name="email" id="sign-up-email"
            value={signUpEmail}
            onChange={(event) => {setSignUpEmail(event.target.value)}}
            placeholder="Enter your email address..." />
          </div>
          <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
            <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="sign-up-password">Password</label>
            <input className={`${styles['form-field']}`} type="password" name="email" id="sign-up-password"
            value={signUpPassword}
            onChange={(event) => {setSignUpPassword(event.target.value)}}
            placeholder='Enter your password...' />
          </div>
          <input className={`${styles['submit-button']}`} type="submit" value="Sign Up" />
        </form>
      )}
    </div>
  );
};

export {SignInUp};
