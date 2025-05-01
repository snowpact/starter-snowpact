import { useNavigate } from 'react-router-dom';

import { LoginResponseType } from '@/api/lib/auth';
import { LoginForm } from '@/components/organisms/forms/LoginForm';
import { useAuthContext } from '@/contexts/AuthContext';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { saveToken } = useAuthContext();

  const onSuccess = (response: LoginResponseType) => {
    saveToken(response.accessToken, response.refreshToken);
    navigate('/');
  };

  return <LoginForm onSuccess={onSuccess} />;
};
