import express from 'express';
import { routerSettingsEditors } from './settings-editors-routers';

const routerChild = express.Router({ mergeParams: true });

// Без проверки авторизации ==================================================================================
routerChild.use('/some-path', routerSettingsEditors);

export { routerChild };
