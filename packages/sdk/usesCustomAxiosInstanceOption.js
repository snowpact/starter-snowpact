const fs = require('fs');
const path = require('path');

const directory = './src'; // root directory

function processFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;

        let modifiedData = data;

        // Remove import axios from 'axios'; and import * as axios from 'axios';
        modifiedData = modifiedData.replace(/import axios from 'axios';/g, '');
        modifiedData = modifiedData.replace(/import \* as axios from 'axios';/g, '');

        // Add AxiosInstance to import type { AxiosRequestConfig, AxiosResponse } from 'axios';
        modifiedData = modifiedData.replace(/import type { AxiosRequestConfig, AxiosResponse } from 'axios';/g, "import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';");

        // Transform export const getXXXXApi = () => { to export const getXXXXApi = (axios: AxiosInstance) => {
        modifiedData = modifiedData.replace(/export const get(\w+)ApiCollection = \(\) => {/g, 'export const get$1ApiCollection = (axios: AxiosInstance) => {');

        // Transform axios.default.X to axios.X
        modifiedData = modifiedData.replace(/axios\.default\.(\w+)\(/g, 'axios.$1(');

        fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
            if (err) throw err;
            console.log(`Modified ${filePath}`);
        });
    });
}

function traverseDirectory(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            const filePath = path.join(dir, file);

            fs.stat(filePath, (err, stats) => {
                if (err) throw err;

                if (stats.isDirectory()) {
                    traverseDirectory(filePath);
                } else if (stats.isFile() && file.endsWith('.api.ts')) {
                    processFile(filePath);
                }
            });
        });
    });
}

traverseDirectory(directory);