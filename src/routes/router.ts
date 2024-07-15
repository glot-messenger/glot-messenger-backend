import express from 'express';
import { routerSettingsEditors } from './settings-editors-routers';

const routerChild = express.Router({ mergeParams: true });

// Без проверки авторизации ==================================================================================
routerChild.use('/settings-editors', routerSettingsEditors);

export { routerChild };
