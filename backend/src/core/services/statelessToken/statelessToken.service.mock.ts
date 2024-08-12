import { vi, Mocked } from 'vitest';

import { StatelessTokenServiceInterface } from './statelessToken.service.interface';

export const getStatelessTokenServiceMock = (): Mocked<StatelessTokenServiceInterface> => ({
  generateToken: vi.fn().mockResolvedValue(undefined),
  verifyToken: vi.fn().mockResolvedValue(undefined),
});
