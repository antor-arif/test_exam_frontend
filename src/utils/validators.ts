export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};
