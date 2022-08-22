import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import styles from './profileHeader.module.scss';
import layout from '../../styles/layout.module.scss';

import api from '../../services/api';

import {useAuth} from '../../hooks/useAuth';

import {User} from '../../@types/api';

import {ProfilePostsReload, SetProfilePostsReload} from '../../pages/profile/profile';

interface ProfileHeaderProps {
  profile?: User;
  setProfile: React.Dispatch<React.SetStateAction<User | undefined>>;
  profilePostsReload: ProfilePostsReload;
  setProfilePostsReload: SetProfilePostsReload;
}

const ProfileHeader = function ({profile, setProfile, profilePostsReload, setProfilePostsReload}: ProfileHeaderProps) {
  const [currentSetting, setCurrentSetting] = useState<'update' | 'delete' | 'closed'>('closed');

  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {signOut} = useAuth();
  const navigate = useNavigate();

  const handleUpdateUser = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updateUser = await api.put('/users', {
      name: name,
      username: username,
      email: email,
      password: password
    });

    if (updateUser.data.error?.name === 'TokenExpiredError') {
      signOut(() => {
        return navigate('/', {replace: true});
      });
    }

    if (updateUser.data.error) return console.log(updateUser.data.error);

    if (updateUser.data.result === 'user successfully updated!') {
      if (name || username) {
        setProfilePostsReload(profilePostsReload ? false : true);
      }

      setName('');
      setUsername('');
      setEmail('');
      setPassword('');

      return setProfile(updateUser.data.data);
    }

    return console.log(updateUser.data);
  };

  const handleDeleteUser = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const deleteUser = await api.delete('/users');

    if (deleteUser.data.error) return console.log(deleteUser.data.error);

    return signOut(() => {
      return navigate('/');
    });
  };

  const handleSignOut = async function () {
    signOut(() => {
      navigate('/');
    });
  };

  return (
    <div className={`${styles['profile-header']} ${layout['mt-5']}`}>
      <div className={`${styles['profile-data']} ${layout['mb-3']}`}>
        <div>
          <div className={`${layout['flex']} ${layout['justify-between']}`}>
            <div>
              <span className={`${styles['name-data']}`}>{profile?.name}</span>
            </div>
            <div className={`${layout['flex']}`}>
              <div className={`${layout['mr-1']}`}>
                <button className={`${styles['setting-button']}`} onClick={() => {setCurrentSetting('update')}}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="15px" height="15px">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className={`${layout['mr-1']}`}>
                <button className={`${styles['setting-button']}`} onClick={() => {setCurrentSetting('delete')}}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="15px" height="15px">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                </button>
              </div>
              <div>
                <button className={`${styles['setting-button']}`} onClick={handleSignOut}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="15px" height="15px">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className={`${layout['flex']}`}>
            <div>
              <span className={`${styles['username-data']}`}>@{profile?.username}</span>
            </div>
          </div>
        </div>
      </div>
      {currentSetting === 'closed' ? (
        null
      ) : (
        <div className={`${styles['profile-setting-box']} ${layout['mb-3']}`}>
          {currentSetting === 'delete' &&
            <div className={`${layout['flex']} ${layout['column']} ${layout['align-center']} ${layout['mt-5']} ${layout['mb-5']}`}>
              <div>
                <span className={`${styles['delete-account-text']}`}>Do you really want to delete your account?</span>
              </div>
              <div className={`${layout['flex']}`}>
                <button className={`${styles['setting-button']} ${layout['mr-2']}`} onClick={() => {setCurrentSetting('closed')}}>keep my account</button>
                <form onSubmit={handleDeleteUser}>
                  <button className={`${styles['setting-button']} ${styles['hover-red']}`}>delete my account</button>
                </form>
              </div>
            </div>
          }
          {currentSetting === 'update' &&
            <div className={`${layout['flex']} ${layout['column']} ${layout['align-center']} ${layout['mt-3']} ${layout['mb-5']}`}>
              <div className={`${layout['flex']} ${layout['justify-end']} ${layout['col-12']} ${layout['mr-5']}`}>
                <button className={`${styles['close-button']}`} onClick={() => {setCurrentSetting('closed')}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <form className={`${layout['col-11']}`} onSubmit={handleUpdateUser}>
                <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
                  <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="update-user-name">Name</label>
                  <input className={`${styles['form-field']}`} type="text" name="name" id="update-user-name"
                  value={name}
                  onChange={(event) => {setName(event.target.value)}}
                  placeholder="Enter your full name..." />
                </div>
                <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
                  <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="update-user-username">Username</label>
                  <input className={`${styles['form-field']}`} type="text" name="username" id="update-user-username"
                  value={username}
                  onChange={(event) => {setUsername(event.target.value)}}
                  placeholder="Enter your username..." />
                </div>
                <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
                  <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="update-user-email">Email Address</label>
                  <input className={`${styles['form-field']}`} type="text" name="email" id="update-user-email"
                  value={email}
                  onChange={(event) => {setEmail(event.target.value)}}
                  placeholder="Enter your email address..." />
                </div>
                <div className={`${layout['flex']} ${layout['column']} ${layout['mb-3']}`}>
                  <label className={`${styles['form-label']} ${layout['mb-1']}`} htmlFor="update-user-password">Password</label>
                  <input className={`${styles['form-field']}`} type="password" name="password" id="update-user-password"
                  value={password}
                  onChange={(event) => {setPassword(event.target.value)}}
                  placeholder='Enter your password...' />
                </div>
                <input className={`${styles['submit-button']}`} type="submit" value="Update" />
              </form>
            </div>
          }
        </div>
      )}
    </div>
  );
};

export {ProfileHeader};
