import express, { Request, Response } from 'express';
import { getEndSegmentForUrlDataBase } from '../utils';
import config from 'config';

import {
	FIREBASE,
	END_POINT_SLOTS_EDITORS
} from '../core';

const routerSlotsEditors = express.Router({ mergeParams: true });

routerSlotsEditors.post('/', async(req: Request, res: Response) => {
	const { columnsIdsWithSlotsPack } = req.body;

	if (!columnsIdsWithSlotsPack || (columnsIdsWithSlotsPack && typeof columnsIdsWithSlotsPack !== 'object')) {
		res.status(400).send({
			slotsEditor: null
		});

		return;
	}

	const arrayIdsColumns = Object.keys(columnsIdsWithSlotsPack);

	let isErrorValue = false;

	// проверяем, чтобы у id колонки обязательно было соотношение с массивом слотов, иначе что-то не так, и можно кидать ошибку
	for (let m = 0; m < arrayIdsColumns.length; m++) {
		const idColumn = arrayIdsColumns[m];

		const value = columnsIdsWithSlotsPack[idColumn];

		if (!Array.isArray(value)){
			isErrorValue = true;

			break;
		}
	}

	if (isErrorValue) {
		res.status(400).send({
			slotsEditor: null
		});

		return;
	}

	const baseUrlSlotsEditors: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_SLOTS_EDITORS);

	if (config.get('nameDB') === FIREBASE) {
		const responseSlotsEditors = await fetch(baseUrlSlotsEditors, {
			method: 'GET'
		});

		const dataSlotsEditors = await responseSlotsEditors.json();

		for (let z = 0; z < arrayIdsColumns.length; z++) {
			const idColumn = arrayIdsColumns[z];

			const slotsIdsForColumn = columnsIdsWithSlotsPack[idColumn];

			const pack: object[] = [];

			slotsIdsForColumn.forEach((slotIdValue: string) => {
				const slotObject = dataSlotsEditors[slotIdValue];

				if (slotObject) {
					pack.push(slotObject);
				}
			});

			columnsIdsWithSlotsPack[idColumn] = pack;
		}

		res.status(200).send({
			slotsEditor: columnsIdsWithSlotsPack
		});

		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		slotsEditor: null
	});
});

export { routerSlotsEditors };
