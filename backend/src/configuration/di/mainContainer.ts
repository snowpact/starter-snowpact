import 'reflect-metadata';

import { Container } from 'inversify';

import { entityContainer } from './entityContainer';
import { gatewayContainer } from './gatewayContainer';
import { infraContainer } from './infraContainer';
import { serviceContainer } from './serviceContainer';
import { useCaseContainer } from './useCaseContainer';

const mainContainer = new Container();

mainContainer.load(serviceContainer);
mainContainer.load(useCaseContainer);
mainContainer.load(entityContainer);
mainContainer.load(infraContainer);
mainContainer.load(gatewayContainer);

export { mainContainer };
