import express, { Request, Response } from 'express';
import { getEndSegmentForUrlDataBase } from '../utils';
import config from 'config';
import { modelSlot } from '../models';

import {
	FIREBASE,
	MONGO_DB,
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

	if (config.get('nameDB') === FIREBASE) {
		const baseUrlSlotsEditors: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_SLOTS_EDITORS);

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

	if (config.get('nameDB') === MONGO_DB) {
		try {
			const slotsData: any[] = await modelSlot.find();

			for (let z = 0; z < arrayIdsColumns.length; z++) {
				const idColumn = arrayIdsColumns[z];

				const slotsIdsForColumn = columnsIdsWithSlotsPack[idColumn];

				const pack: object[] = [];

				for (const slotIdValue of slotsIdsForColumn) {
					marker: for (let z = 0; z < slotsData.length; z++) {
						const slotDataValue = slotsData[z];

						if (slotDataValue && (slotDataValue._id.toString() === slotIdValue)) {
							pack.push(slotDataValue);

							break marker;
						}
					}
				}

				columnsIdsWithSlotsPack[idColumn] = pack;
			}

			res.status(200).send({
				slotsEditor: columnsIdsWithSlotsPack
			});

		} catch (err: any) {
			console.log('Error when getting the editor slots...');

			console.log(`Error: ${err}.`);

			res.status(500).send({
				slotsEditor: null
			});
		}

		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		slotsEditor: null
	});
});

export { routerSlotsEditors };
