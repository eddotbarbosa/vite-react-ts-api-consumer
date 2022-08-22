import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import styles from './profileFeed.module.scss';
import layout from '../../styles/layout.module.scss';

import api from '../../services/api';

import {useAuth} from '../../hooks/useAuth';

import {formatDate} from '../../utils/formatDate';

import {PostWithAuthor, User} from '../../@types/api';

import {ProfilePostsReload, SetProfilePostsReload} from '../../pages/profile/profile';


interface ProfileFeedProps {
  profile?: User;
  profilePostsReload: ProfilePostsReload;
  setProfilePostsReload: SetProfilePostsReload;
}

const ProfileFeed = function ({profile, profilePostsReload, setProfilePostsReload}: ProfileFeedProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>();

  const [postContent, setPostContent] = useState<string>('');

  const [selectedPost, setSelectedPost] = useState<PostWithAuthor>();
  const [selectedPostSetting, setSelectedPostSetting] = useState<'update' | 'delete' | 'close'>('close');

  const {signOut} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function getPosts () {
      const getPosts = await api.get(`/posts/list/${profile?.username}`);

      if (getPosts.data.error) return console.log(getPosts.data.error);

      if (selectedPost) {
        setSelectedPost(getPosts.data.find((post: PostWithAuthor) => {
          return post.id === selectedPost.id;
        }));
      }

      return setPosts(getPosts.data.reverse());
    }

    getPosts();
  }, [profilePostsReload]);

  const handleClosePostSetting = function () {
    setSelectedPostSetting('close');
    setSelectedPost(undefined);
  }

  const handleDeletePostForm = async function (event: React.FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();

    const deletePost = await api.delete('/posts', {
      data: {
        id: postId
      }
    });

    if (deletePost.data.error?.name === 'TokenExpiredError') {
      signOut(() => {
        return navigate('/', {replace: true});
      });
    }

    if (deletePost.data.error) return console.log(deletePost.data.error);

    console.log(deletePost.data);

    setPosts(posts?.filter((post) => {
      return post.id !== postId
    }));

    return handleClosePostSetting();
  };

  const handleUpdatePost = async function (event: React.FormEvent<HTMLFormElement>, postId: string, content: string) {
    event.preventDefault();

    const updatePost = await api.put('/posts', {
      id: postId,
      content: content
    });

    if (updatePost.data.error?.name === 'TokenExpiredError') {
      signOut(() => {
        return navigate('/', {replace: true});
      });
    }

    if (updatePost.data.error) return console.log(updatePost.data.error);

    const editedPostsArray = posts?.map((post) => {
      if (post.id === postId) {
        return {...post, content: content}
      }
      return post;
    });
0
    setPosts(editedPostsArray);

    const editedSelectedPost = {
      ...selectedPost,
      content: content
    }

    setSelectedPost(editedSelectedPost as PostWithAuthor);

    return setPostContent('');
  };

  return (
    <div className={`${styles['profile-feed']} ${layout['flex']} ${layout['justify-center']}`}>
      <div className={`${layout['col-11']}`}>
        { selectedPost &&
          <div className={`${styles['post-settings']} ${layout['mb-5']} ${layout['mt-5']}`}>
            <div className={`${layout['flex']} ${layout['justify-between']}`}>
              <div className={`${layout['mb-1']}`}>
                <span className={`${styles['post-setting-header']}`}>selected post</span>
              </div>
              <div className={`${layout['flex']}`}>
                <div className={`${layout['mr-1']}`}>
                  <button className={`${styles['setting-button']}`} onClick={() => {setSelectedPostSetting('update')}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="15px" height="15px">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div className={`${layout['mr-1']}`}>
                  <button className={`${styles['setting-button']}`} onClick={() => {setSelectedPostSetting('delete')}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="15px" height="15px">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div>
                  <button className={`${styles['setting-button']}`} onClick={handleClosePostSetting}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="15px" height="15px">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className={`${styles['post']}`}>
              <div className={`${layout['flex']} ${layout['justify-between']}`}>
                <div>
                  <span className={`${styles['post-user-name']} ${layout['mr-2']}`}>{selectedPost?.author.name}</span>
                  <span className={`${styles['post-user-username']} ${layout['mr-2']}`}>@{selectedPost?.author.username}</span>
                  <span className={`${styles['post-date']}`}>{formatDate(selectedPost?.createdAt)}</span>
                </div>
              </div>
              <div className={`${styles['post-content']}`}>
                <p>{selectedPost?.content}</p>
              </div>
            </div>
            {selectedPostSetting === 'delete' &&
              <div className={`${layout['mt-4']} ${layout['mb-3']}`}>
                <div className={`${layout['flex']} ${layout['justify-center']}`}>
                  <span className={`${styles['delete-post-message']}`}>Do you really want to delete this post?</span>
                </div>
                <div className={`${layout['flex']} ${layout['justify-center']}`}>
                  <div className={`${layout['mr-2']}`}>
                    <button className={`${styles['setting-button']}`}>Keep my post</button>
                  </div>
                  <form onSubmit={(event) => (handleDeletePostForm(event, selectedPost.id))}>
                    <div>
                      <input className={`${styles['setting-button']} ${styles['hover-red']}`} type="submit" value="Delete my post" />
                    </div>
                  </form>
                </div>
              </div>
            }
            {selectedPostSetting === 'update' &&
              <form className={`${layout['flex']}  ${layout['justify-between']} ${layout['mt-5']} ${layout['mb-3']}`} onSubmit={(event) => {handleUpdatePost(event, selectedPost.id, postContent)}}>
                <input className={`${styles['post-form-input']} ${layout['col-12']}`} type="text" name="content"
                value={postContent}
                onChange={(event) => {setPostContent(event.target.value)}}
                placeholder="Type the new content..." />
                <input className={`${styles['submit-button']}`} type="submit" value="Submit" />
              </form>
            }
          </div>
        }
        <ul className={`${styles['post-list']}`}>
          {posts?.length ? (
            posts.map((post) => {
              return (
                <li key={post.id} className={`${styles['post-list-item']} ${layout['mb-5']}`}>
                  <div className={`${styles['post']}`}>
                    <div className={`${layout['flex']} ${layout['justify-between']}`}>
                      <div>
                        <span className={`${styles['post-user-name']} ${layout['mr-2']}`}>{post.author.name}</span>
                        <span className={`${styles['post-user-username']} ${layout['mr-2']}`}>@{post.author.username}</span>
                        <span className={`${styles['post-date']}`}>{formatDate(post.createdAt)}</span>
                      </div>
                      <button className={`${styles['setting-button']}`} onClick={() => {setSelectedPost(post)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="15px" height="15px">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>
                    <div className={`${styles['post-content']}`}>
                      <p>{post.content}</p>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className={`${styles['post-list-item']} ${layout['flex']} ${layout['justify-center']} ${layout['mb-5']}`}>
              <span className={`${styles['post-list-empity-message']}`}>Your post list are empity...</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export {ProfileFeed};
