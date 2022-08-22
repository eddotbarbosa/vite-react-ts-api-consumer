import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

import styles from './createPost.module.scss';
import layout from '../../styles/layout.module.scss';

import api from '../../services/api';

import {useAuth} from '../../hooks/useAuth';

import {ProfilePostsReload, SetProfilePostsReload} from '../../pages/profile/profile';

interface CreatePostProps {
  className: string;
  profilePostReload: ProfilePostsReload;
  setProfilePostReload: SetProfilePostsReload;
}

const CreatePost = function ({className, profilePostReload, setProfilePostReload}: CreatePostProps) {
  const [content, setContent] = useState<string>('');

  const {signOut} = useAuth();
  const navigate = useNavigate();


  const handleCreatePost = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const createPost = await api.post('/posts', {
      content: content
    });

    if (createPost.data.error?.name === 'TokenExpiredError') {
      return signOut(() => {
        return navigate('/');
      });
    }

    if (createPost.data.error) return console.log(createPost.data.error);

    setProfilePostReload(profilePostReload ? false : true);

    setContent('');

    return console.log(createPost.data);
  };

  return (
    <div className={className + `${styles['create-post']} ${layout['flex']} ${layout['justify-center']}`}>
      <form className={`${layout['flex']} ${layout['column']} ${layout['col-11']} ${layout['mt-5']} ${layout['mb-5']}`} onSubmit={handleCreatePost}>
        <textarea className={`${styles['create-post-textarea']} ${layout['mb-2']}`} name="content"
        value={content}
        onChange={(event) => {setContent(event.target.value)}} placeholder="What's happen?"></textarea>
        <div className={`${layout['flex']} ${layout['justify-end']}`}>
          <button className={`${styles['submit-button']}`} type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export {CreatePost};
