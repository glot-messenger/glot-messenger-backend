import express, { Request, Response } from 'express';
import config from 'config';
import { modelWhatsNew } from '../models';

import { MONGO_DB } from '../core';

const routerWhatsNew = express.Router({ mergeParams: true });

routerWhatsNew.post('/', async(req: Request, res: Response) => {
	if (config.get('nameDB') === MONGO_DB) {
		try {
			const whatsNewData = await modelWhatsNew.find();

			if (!whatsNewData) {
				res.status(404).send({
					whatsNew: null
				});

				return;
			}

			whatsNewData.sort((whatsNewA: any, whatsNewB: any) => {
				return whatsNewB.timeCreatedInMs - whatsNewA.timeCreatedInMs;
			});

			let result = [];

			for (let m = 0; m < whatsNewData.length; m++) {
				result[m] = whatsNewData[m];

				if (result.length >= 5) {
					break;
				}
			}

			res.status(200).send({
				whatsNew: result
			});

		} catch (err: any) {
			console.log('Error when getting the whats new data...');

			console.log(`Error: ${err}.`);

			res.status(500).send({
				whatsNew: null
			});
		}

		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		whatsNew: null
	});
});

export { routerWhatsNew };
