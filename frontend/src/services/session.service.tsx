import { getSession, removeSession } from 'react-session-api';

export function createUserSession(userData: { id: any; email: any; token: any; }) {
  localStorage.setItem('user', JSON.stringify(userData));
}


export function getUserSession() {
  const session = localStorage.getItem('user');
  if (session) return session;

  const token = localStorage.getItem('token');
  if (token) {
    return { token }; 
  }
  return null;
}

export function destroyUserSession() {
  removeSession('user');
  localStorage.removeItem('token'); 
}
