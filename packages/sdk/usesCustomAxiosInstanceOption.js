// See https://github.com/orval-labs/orval/discussions/1617 for more information
const fs = require('fs');
const path = require('path');

const directory = './src/api'; // replace with your directory path

fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        // Skip files with the extension .schemas.ts
        if (path.extname(file) === '.schemas.ts') {
            continue;
        }

        const filePath = path.join(directory, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;

            let modifiedData = data;

            // Remove import axios from 'axios';
            modifiedData = modifiedData.replace(/import axios from 'axios';/g, '');
            modifiedData = modifiedData.replace(/import \* as axios from 'axios';/g, '');

            // Add AxiosInstance to import type { AxiosRequestConfig, AxiosResponse } from 'axios';
            modifiedData = modifiedData.replace(/import type { AxiosRequestConfig, AxiosResponse } from 'axios';/g, "import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';");

            // Transform export const getXXXXApi = () => { to export const getXXXXApi = (axios: AxiosInstance) => {
            modifiedData = modifiedData.replace(/export const get(\w+)Api = \(\) => {/g, 'export const get$1Api = (axios: AxiosInstance) => {');
            modifiedData = modifiedData.replace(/axios\.default\.(\w+)\(/g, 'axios.$1(');

            fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
                if (err) throw err;
                console.log(`Modified ${filePath}`);
            });
        });
    }
});