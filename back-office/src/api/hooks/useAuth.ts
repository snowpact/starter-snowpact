import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LoginParams, loginRequest, LoginResponseType } from '../lib/auth';

export const useLoginMutation = ({
  onSuccess,
}: {
  onSuccess?: (response: LoginResponseType, params: LoginParams) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponseType, void, LoginParams>({
    mutationFn: params => loginRequest(params),
    onSuccess: (data, params) => {
      queryClient.removeQueries();
      if (onSuccess) {
        onSuccess(data, params);
      }
    },
  });
};
