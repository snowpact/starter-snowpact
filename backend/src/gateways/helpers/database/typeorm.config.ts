import { envConfig } from '@/configuration/env/envConfig.singleton';

import { ClientDatabase } from './clientDatabase/clientDatabase';

const clientDatabase = new ClientDatabase();

void clientDatabase.connect(envConfig.dbUrl);

export default clientDatabase.getDataSource();
