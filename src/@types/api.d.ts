// authentication
export interface AuthToken {
  id?: string;
  username?: string;
  iat?: number;
  exp?: number;
}

export interface AuthtokenError {
  name: string;
  message: string;
  expiredAt?: string;
}

// user
export interface User {
  id: string;
	name: string;
	username: string;
	email: string;
	password: string;
	createdAt: string;
	updatedAt: string;
}

// post
export interface Author {
  name: string;
  username: string;
}

export interface Post {
  id: string,
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithAuthor {
  id: string,
  content: string;
  author: Author;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
