import { envConfig } from '@/configuration/env/envConfig.singleton';

import { ClientDatabase } from './clientDatabase/clientDatabase';

const clientDatabase = new ClientDatabase(envConfig);

void clientDatabase.connect(envConfig.dbUrl);

export default clientDatabase.getDataSource();
