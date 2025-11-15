export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('token');
  return !!token;
};

export const getUser = (): any => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('token');
};

export const logout = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

