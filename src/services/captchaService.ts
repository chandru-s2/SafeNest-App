import axios from 'axios';

let inMemoryToken: { jwt: string; expiresAt: number } | null = null;

export const captchaService = {
  isTokenValid: () => {
    if (!inMemoryToken) return false;
    return Date.now() < inMemoryToken.expiresAt;
  },

  setToken: (jwt: string, expiresIn: number) => {
    inMemoryToken = {
      jwt,
      expiresAt: Date.now() + expiresIn * 1000,
    };
  },

  clearToken: () => {
    inMemoryToken = null;
  },

  validateToken: async (token: string) => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/v1/captcha/verify', { token });
      const { valid, jwt, expiresIn } = response.data;
      if (valid) {
        captchaService.setToken(jwt, expiresIn);
      }
      return valid;
    } catch (error) {
      return false;
    }
  },
};
