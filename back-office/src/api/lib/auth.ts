import axios from 'axios';
import Cookies from 'js-cookie';

export type LoginResponseType = {
  accessToken: string;
  refreshToken: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export const loginRequest = async ({
  email,
  password,
}: LoginParams): Promise<LoginResponseType> => {
  // const { data } = await axios.post('/api/public/auth/login', { email, password });

  console.log('email', email);
  console.log('password', password);
  // TODO: Enable this when we do not have API, and comment the above line
  const data = {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
  };

  Cookies.set('at', data.accessToken);
  Cookies.set('rt', data.refreshToken);

  return data;
};

export const refreshRequest = async (): Promise<LoginResponseType> => {
  const accessToken = Cookies.get('at');
  const refreshToken = Cookies.get('rt');

  const {
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  } = await axios.post('/public/auth/refresh', {
    accessToken,
    refreshToken,
  });

  Cookies.set('at', newAccessToken);
  Cookies.set('rt', newRefreshToken);

  return { accessToken: newAccessToken || '', refreshToken: refreshToken as string };
};
