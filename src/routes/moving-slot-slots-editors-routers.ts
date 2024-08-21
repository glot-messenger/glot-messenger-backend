import express, { Request, Response } from 'express';
import config from 'config';
import { MONGO_DB } from '../core';

import {
	modelColumn,
	modelSlot
} from '../models';

const routerMovingSlotSlotsEditors = express.Router({ mergeParams: true });

routerMovingSlotSlotsEditors
	.route('/:id')
		.post(async(req: Request, res: Response) => {
			const { slotId, columnId, value } = req.body;

			if (!slotId || !columnId || Array.isArray(value) || !(value instanceof Object)) {
				res.status(400).send({
					movableSlot: null,
					newIndex: -1,
					newSlotsOrder: null
				});

				return;
			}

			if (config.get('nameDB') === MONGO_DB) {
				try {
					const searchSlot = await modelSlot.findById(slotId);

					if (!searchSlot) {
						res.status(404).send({
							movableSlot: null,
							newIndex: -1,
							newSlotsOrder: null
						});

						return;
					}

					const searchColumn = await modelColumn.findById(columnId);

					if (!searchColumn) {
						res.status(404).send({
							movableSlot: null,
							newIndex: -1,
							newSlotsOrder: null
						});

						return;
					}

					const slotsArrayIds = searchColumn.slots;

					let currentIndex: number = slotsArrayIds.findIndex((idObjectMongo): boolean => {
						return idObjectMongo.toString() === slotId;
					});

					let isChange: boolean = false;

					let newSlotsArrayIds = [ ...slotsArrayIds ];

					switch(value.position) {
						case 'index + 1':
							if (currentIndex !== newSlotsArrayIds.length - 1) {
								isChange = true;

								newSlotsArrayIds[currentIndex] = newSlotsArrayIds[currentIndex + 1];
								newSlotsArrayIds[currentIndex + 1] = searchSlot['_id'];

								currentIndex = currentIndex + 1;
							}

							break;
						case 'index - 1':
							if (currentIndex !== 0) {
								isChange = true;

								newSlotsArrayIds[currentIndex] = newSlotsArrayIds[currentIndex - 1];
								newSlotsArrayIds[currentIndex - 1] = searchSlot['_id'];

								currentIndex = currentIndex - 1;
							}

							break;
						case 'index = first':
							if (currentIndex !== 0) {
								isChange = true;

								for (let z = currentIndex; z > 0; z--) {
									newSlotsArrayIds[z] = newSlotsArrayIds[z - 1];
									newSlotsArrayIds[z - 1] = searchSlot['_id'];
								}

								currentIndex = 0;
							}

							break;
						case 'index = last':
							if (currentIndex !== newSlotsArrayIds.length - 1) {
								isChange = true;

								for (let z = currentIndex; z < newSlotsArrayIds.length - 1; z++) {
									newSlotsArrayIds[z] = newSlotsArrayIds[z + 1];
									newSlotsArrayIds[z + 1] = searchSlot['_id'];
								}

								currentIndex = newSlotsArrayIds.length - 1;
							}

							break;
					}

					const slotsOrder = newSlotsArrayIds.map((idObjectMongo): string => {
						return idObjectMongo.toString();
					});

					if (!isChange) {
						res.status(200).send({
							movableSlot: searchSlot,
							newIndex: currentIndex,
							newSlotsOrder: slotsOrder
						});

						return;
					}

					const updatedEditorColumn = await modelColumn.findByIdAndUpdate({ _id: columnId }, { slots: newSlotsArrayIds }, { new: true });

					if (!updatedEditorColumn) {
						res.status(404).send({
							movableSlot: null,
							newIndex: -1,
							newSlotsOrder: null
						});

						return;
					}

					res.status(200).send({
						movableSlot: searchSlot,
						newIndex: currentIndex,
						newSlotsOrder: slotsOrder
					});

				} catch (err: any) {
					console.log('Error moving slot...');

					console.log(`Error: ${err}.`);

					res.status(500).send({
						movableSlot: null,
						newIndex: -1,
						newSlotsOrder: null
					});
				}

				return;
			}

			console.log('There must be a data collection trip to another database...');

			res.status(404).send({
				movableSlot: null,
				newIndex: -1,
				newSlotsOrder: null
			});
		});

export { routerMovingSlotSlotsEditors };
