
export const hasValidToken = (): boolean => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return false;
  }
  return token.length > 0; 
};

export const clearAuthData = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
};
