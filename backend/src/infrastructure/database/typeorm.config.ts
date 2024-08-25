import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { ClientDatabase } from './clientDatabase/clientDatabase';

const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
const clientDatabase = new ClientDatabase(envConfig);

void clientDatabase.connect(envConfig.dbUrl);

export default clientDatabase.getDataSource();
