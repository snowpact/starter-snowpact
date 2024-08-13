import fs from 'fs/promises';
import path from 'path';

import { Logger } from '@/gateways/logger/logger';

import { bootstrap } from '../loader/server';

const generateOpenapiDocJson = async (): Promise<void> => {
  const logger = new Logger();
  try {
    const { app, server } = bootstrap();

    // Générer le document OpenAPI
    const openApiDoc = app.getOpenAPI31Document({
      openapi: '3.1.0',
      info: {
        version: '1.0.0',
        title: 'My API',
      },
    });

    // Écrire le document dans un fichier
    const outputPath = path.join(__dirname, './openapi.json');
    await fs.writeFile(outputPath, JSON.stringify(openApiDoc, null, 2));
    logger.info(`OpenAPI document generated at ${outputPath}`);

    server.close();
  } catch (error) {
    logger.error('Error generating OpenAPI document', error as Error);
  }
};

void generateOpenapiDocJson();
