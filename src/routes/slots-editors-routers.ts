import express, { Request, Response } from 'express';
import { getEndSegmentForUrlDataBase } from '../utils';
import config from 'config';

import {
	FIREBASE,
	END_POINT_SLOTS_EDITORS
} from '../core';

const routerSlotsEditors = express.Router({ mergeParams: true });

routerSlotsEditors.post('/', async(req: Request, res: Response) => {
	const { columnsIds } = req.body;

	if (!columnsIds || (columnsIds && !Array.isArray(columnsIds))) {
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

		const arrayIdsSlotsEditors = Object.keys(dataSlotsEditors);

		const columnsPack: Record<string, string> = {}

		for (let z = 0; z < columnsIds.length; z++) {
			const columnId: string = columnsIds[z];

			columnsPack[columnId] = columnId;
		}

		console.log(columnsPack, 'columnsPack');

		const slotsPack: Record<string, Array<any>> = {};

		for (let m = 0; m < arrayIdsSlotsEditors.length; m++) {
			const idSlot = arrayIdsSlotsEditors[m];

			const slot = dataSlotsEditors[idSlot];

			const idColumnForSlot = slot.columnId;

			if (columnsPack[idColumnForSlot]) {
				const arraySlots = slotsPack[idColumnForSlot];

				if (Array.isArray(arraySlots)) {
					// доделать, в правильном порядке должны стоять слоты для колонки
				}
			}
		}

		res.status(200).send({
			slotsEditor: null
		});

		return;
	}

	console.log('There must be a data collection trip to another database...');

	res.status(404).send({
		slotsEditor: null
	});
});

export { routerSlotsEditors };
