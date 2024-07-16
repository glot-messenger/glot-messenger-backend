import express from 'express';
import { routerSettingsEditors } from './settings-editors-routers';
import { END_POINT_SETTINGS_EDITORS } from '../core';

const routerChild = express.Router({ mergeParams: true });

// Без проверки авторизации ==================================================================================
routerChild.use(END_POINT_SETTINGS_EDITORS, routerSettingsEditors);

export { routerChild };
