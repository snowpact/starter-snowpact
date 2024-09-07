import { getPublicApi } from '@packages/sdk/dist';

import { axiosInstance } from './axios';

export const PublicApi = getPublicApi(axiosInstance);
