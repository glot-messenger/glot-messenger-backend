import express, { Request, Response } from 'express';
import config from 'config';
import { MONGO_DB } from '../core';

import {
	modelColumn,
	modelSettingsEditor
} from '../models';

const routerMovingColumnColumnsEditors = express.Router({ mergeParams: true });

routerMovingColumnColumnsEditors
	.route('/:id')
		.post(async(req: Request, res: Response) => {
			const { settingId, columnId, value } = req.body;

			if (!settingId || !columnId || Array.isArray(value) || !(value instanceof Object)) {
				res.status(400).send({
					movableColumn: null,
					newIndex: -1,
					newColumnsOrder: null
				});

				return;
			}

			if (config.get('nameDB') === MONGO_DB) {
				try {
					const searchColumn = await modelColumn.findById(columnId);

					if (!searchColumn) {
						res.status(404).send({
							movableColumn: null,
							newIndex: -1,
							newColumnsOrder: null
						});

						return;
					}

					const searchSettingsEditor = await modelSettingsEditor.findById(settingId);

					if (!searchSettingsEditor) {
						res.status(404).send({
							movableColumn: null,
							newIndex: -1,
							newColumnsOrder: null
						});

						return;
					}

					const columnsArrayIds = searchSettingsEditor.columns;

					let currentIndex: number = columnsArrayIds.findIndex((idObjectMongo): boolean => {
						return idObjectMongo.toString() === columnId;
					});

					let isChange: boolean = false;

					let newColumnsArrayIds = [ ...columnsArrayIds ];

					switch(value.position) {
						case 'index + 1':
							if (currentIndex !== columnsArrayIds.length - 1) {
								isChange = true;

								newColumnsArrayIds[currentIndex] = newColumnsArrayIds[currentIndex + 1];
								newColumnsArrayIds[currentIndex + 1] = searchColumn['_id'];

								currentIndex = currentIndex + 1;
							}

							break;
						case 'index - 1':
							if (currentIndex !== 0) {
								isChange = true;

								newColumnsArrayIds[currentIndex] = newColumnsArrayIds[currentIndex - 1];
								newColumnsArrayIds[currentIndex - 1] = searchColumn['_id'];

								currentIndex = currentIndex - 1;
							}

							break;
						case 'index = first':
							if (currentIndex !== 0) {
								isChange = true;

								for (let z = currentIndex; z > 0; z--) {
									newColumnsArrayIds[z] = newColumnsArrayIds[z - 1];
									newColumnsArrayIds[z - 1] = searchColumn['_id'];
								}

								currentIndex = 0;
							}

							break;
						case 'index = last':
							if (currentIndex !== columnsArrayIds.length - 1) {
								isChange = true;

								for (let z = currentIndex; z < columnsArrayIds.length - 1; z++) {
									newColumnsArrayIds[z] = newColumnsArrayIds[z + 1];
									newColumnsArrayIds[z + 1] = searchColumn['_id'];
								}

								currentIndex = columnsArrayIds.length - 1;
							}

							break;
					}

					const columnsOrder = newColumnsArrayIds.map((idObjectMongo): string => {
						return idObjectMongo.toString();
					});

					if (!isChange) {
						res.status(200).send({
							movableColumn: searchColumn,
							newIndex: currentIndex,
							newColumnsOrder: columnsOrder
						});

						return;
					}

					const updatedEditorSettings = await modelSettingsEditor.findByIdAndUpdate({ _id: settingId }, { columns: newColumnsArrayIds }, { new: true });

					if (!updatedEditorSettings) {
						res.status(404).send({
							movableColumn: null,
							newIndex: -1,
							newColumnsOrder: null
						});

						return;
					}

					res.status(200).send({
						movableColumn: searchColumn,
						newIndex: currentIndex,
						newColumnsOrder: columnsOrder
					});

				} catch (err: any) {
					console.log('Error moving column...');

					console.log(`Error: ${err}.`);

					res.status(500).send({
						movableColumn: null,
						newIndex: -1,
						newColumnsOrder: null
					});
				}

				return;
			}

			console.log('There must be a data collection trip to another database...');

			res.status(404).send({
				movableColumn: null,
				newIndex: -1,
				newColumnsOrder: null
			});
		});

export { routerMovingColumnColumnsEditors };
