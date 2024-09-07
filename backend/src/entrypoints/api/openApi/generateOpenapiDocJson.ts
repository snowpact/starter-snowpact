import fs from 'fs/promises';
import path from 'path';

import { LoggerInterface } from '@/domain/interfaces/logger.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { bootstrap } from '../loader/server';

const generateOpenapiDocJson = async (): Promise<void> => {
  const appLogger = mainContainer.get<LoggerInterface>(TYPES.Logger);
  try {
    const { app, server } = bootstrap();

    // Générer le document OpenAPI
    const openApiDoc = app.getOpenAPI31Document({
      openapi: '3.1.0',
      tags: [
        {
          name: 'public',
          description: 'Public API',
        },
        {
          name: 'protected',
          description: 'Protected API',
        },
        {
          name: 'internal',
          description: 'Internal API',
        },
        {
          name: 'admin',
          description: 'Admin API',
        },
      ],
      info: {
        version: '1.0.0',
        title: 'Starter API',
      },
    });

    // Écrire le document dans un fichier
    const outputPath = path.join(__dirname, './openapi.json');
    await fs.writeFile(outputPath, JSON.stringify(openApiDoc, null, 2));
    appLogger.info(`OpenAPI document generated at ${outputPath}`);

    server.close();
  } catch (error) {
    appLogger.error('Error generating OpenAPI document', error as Error);
  }
};

void generateOpenapiDocJson();
