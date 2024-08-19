import { vi, Mocked } from 'vitest';

import { StatelessTokenInterface } from '../../domain/interfaces/statelessToken.interface';

export const getStatelessTokenMock = (): Mocked<StatelessTokenInterface> => ({
  generateToken: vi.fn().mockResolvedValue(undefined),
  verifyToken: vi.fn().mockResolvedValue(undefined),
});
