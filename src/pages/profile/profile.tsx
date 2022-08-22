import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import layout from '../../styles/layout.module.scss';

import api from '../../services/api';

import {useAuth} from '../../hooks/useAuth';

import {ProfileHeader} from "../../components/profileHeader/profileHeader";
import {CreatePost} from "../../components/createPost/createPost";
import {ProfileFeed} from '../../components/profileFeed/profileFeed';

import {User} from '../../@types/api';

export type SetProfile =  React.Dispatch<React.SetStateAction<User | undefined>>;
export type ProfilePostsReload = boolean;
export type SetProfilePostsReload = React.Dispatch<React.SetStateAction<boolean>>;

const Profile = function () {
  const [profile, setProfile] = useState<User>();
  const [profilePostsReload, setProfilePostsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {signOut} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      const profile = await api.get('/auth/me');

      if (profile.data.error?.name === 'TokenExpiredError') {
        signOut(() => {
          return navigate('/', {replace: true});
        });
      }

      if (profile.data.error) return console.log({from: 'profile', error: profile.data.error});

      setProfile(profile.data.user);

      return setIsLoading(false);
    }

    getProfile();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <main className={`${layout['container']} ${layout['flex']} ${layout['column']} ${layout['align-center']} ${layout['mb-5']} ${layout['pr-3']} ${layout['pl-3']}`}>
      <ProfileHeader profile={profile} setProfile={setProfile} profilePostsReload={profilePostsReload} setProfilePostsReload={setProfilePostsReload} />
      <CreatePost className={`${layout['mb-3']} `} profilePostReload={profilePostsReload} setProfilePostReload={setProfilePostsReload} />
      <ProfileFeed profile={profile} profilePostsReload={profilePostsReload} setProfilePostsReload={setProfilePostsReload} />
    </main>
  );
};

export {Profile};
