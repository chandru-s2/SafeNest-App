export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePin = (pin: string): boolean => {
  return pin.length === 6 && /^\d+$/.test(pin);
};

export const validateOtp = (otp: string): boolean => {
  return otp.length === 6 && /^\d+$/.test(otp);
};
