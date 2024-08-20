import { describe, it, expect } from 'vitest';

import { StatelessToken } from './statelessToken';

describe('StatelessToken', () => {
  const statelessTokenService = new StatelessToken();

  describe('generateStatelessToken', () => {
    it('should generate a stateless token token', async () => {
      const payload = { userId: '123' };
      const secret = 'secret';
      const expiresIn = 3600;

      const result = await statelessTokenService.generateToken({
        payload,
        secret,
        expiresIn,
      });

      expect(result).toBeDefined();
    });
  });

  describe('verifyStatelessToken', () => {
    it('should verify a stateless token token', async () => {
      const payload = { userId: '123' };
      const secret = 'secret';
      const expiresIn = 3600;

      const token = await statelessTokenService.generateToken({
        payload,
        secret,
        expiresIn,
      });
      const decoded = await statelessTokenService.verifyToken({ token, secret });

      expect(decoded).toMatchObject(payload);
    });
    it('should verify a stateless token token - expired but ignored', async () => {
      const payload = { userId: '123' };
      const secret = 'secret';
      const expiresIn = -1;

      const token = await statelessTokenService.generateToken({ payload, secret, expiresIn });
      const decoded = await statelessTokenService.verifyToken({
        token,
        secret,
        ignoreExpiration: true,
      });

      expect(decoded).toMatchObject(payload);
    });
    it('should throw an error - expired and not ignored', async () => {
      const payload = { userId: '123' };
      const secret = 'secret';
      const expiresIn = -1;

      const token = await statelessTokenService.generateToken({ payload, secret, expiresIn });
      await expect(statelessTokenService.verifyToken({ token, secret })).rejects.toThrow();
    });
    it('should throw an error if stateless token verification fails', async () => {
      const token = 'invalid-token';
      const secret = 'secret';

      await expect(statelessTokenService.verifyToken({ token, secret })).rejects.toThrow();
    });
  });
});
