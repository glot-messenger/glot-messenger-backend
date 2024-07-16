import express, { Request, Response } from 'express';
import config from 'config';

import {
	FIREBASE,
	END_POINT_SETTINGS_EDITORS
} from '../core';

const routerSettingsEditors = express.Router({ mergeParams: true });

routerSettingsEditors.get('/', async(req: Request, res: Response) => {
	const { userId } = req.body;

	if (!userId) {
		res.status(400).send({});

		return;
	}

	if (config.get('nameDB') === FIREBASE) {
		res.status(200).send({});

		return;
	}

	res.status(200).send([]);
});

export { routerSettingsEditors };
