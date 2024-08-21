import { vi, Mocked } from 'vitest';
import { undefined } from 'zod';

import { StatelessTokenServiceInterface } from '@/application/services/statelessToken/statelessToken.service.interface';

export const getStatelessTokenServiceMock = (): Mocked<StatelessTokenServiceInterface> => ({
  generateToken: vi.fn().mockResolvedValue(undefined),
  verifyToken: vi.fn().mockResolvedValue(undefined),
});
