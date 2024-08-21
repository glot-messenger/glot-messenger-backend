import express, { Request, Response } from 'express';
import { SlotModel } from '../lib';
import config from 'config';
import { MONGO_DB } from '../core';

import {
	modelColumn,
	modelSlot
} from '../models';

const routerSlotSlotsEditors = express.Router({ mergeParams: true });

routerSlotSlotsEditors
	.route('/')
	.post(async(req: Request, res: Response) => {
		const { settingId, columnId, data, value } = req.body;

		if (!columnId) {
			res.status(400).send({
				newSlotToTheColumnEditor: null
			});

			return;
		}

		let dataNewSlot = data;

		if (!dataNewSlot) {
			dataNewSlot = new SlotModel({ columnId });
		}

		if (config.get('nameDB') === MONGO_DB) {
			try {
				delete dataNewSlot['_id'];

				const columnEditorData = await modelColumn.findOne({ _id: columnId });

				// Если в базе нет колонки редактора по такому id, значит что-то было передано с клиента не так, т.к. мы не сможем добавить новый слот к несуществующей колонке
				if (!columnEditorData) {
					res.status(404).send({
						newSlotToTheColumnEditor: null
					});

					return;
				}

				const newSlot = await modelSlot.create(dataNewSlot);

				const newColumnEditor = await modelColumn.findByIdAndUpdate({ _id: columnId }, { slots: [...columnEditorData.slots, newSlot._id] }, { new: true });

				// Если при обновлении поля slots у колонки что-то опять пошло не так, мы удаляем созданный slot в базе
				if (!newColumnEditor) {
					await modelSlot.findOneAndDelete({ _id: newSlot._id.toString() });

					res.status(404).send({
						newSlotToTheColumnEditor: null
					});

					return;
				}

				res.status(200).send({
					newSlotToTheColumnEditor: newSlot
				});

			} catch (err: any) {
				console.log('Error when adding new slot...');

				console.log(`Error: ${err}.`);

				res.status(500).send({
					newSlotToTheColumnEditor: null
				});
			}

			return;
		}

		console.log('There must be a data collection trip to another database...');

		res.status(404).send({
			newSlotToTheColumnEditor: null
		});
	});

routerSlotSlotsEditors
	.route('/:id')
		.patch(async(req: Request, res: Response) => {
			const { columnId, slotId, value } = req.body;

			if (!columnId || !slotId || Array.isArray(value) || !(value instanceof Object)) {
				res.status(400).send({
					updatedSlot: null
				});

				return;
			}

			if (config.get('nameDB') === MONGO_DB) {
				try {
					const searchSlot = await modelSlot.findById(slotId);

					if (!searchSlot) {
						res.status(404).send({
							updatedSlot: null
						});

						return;
					}

					if (columnId !== searchSlot.columnId.toString()) {
						res.status(404).send({
							updatedSlot: null
						});

						return;
					}

					const id = searchSlot['_id'];

					const updatedSlot = await modelSlot.findByIdAndUpdate({ _id: slotId }, { ...value, _id: id }, { new: true });

					if (!updatedSlot) {
						res.status(404).send({
							updatedSlot: null
						});

						return;
					}

					res.status(200).send({
						updatedSlot
					});

				} catch (err: any) {
					console.log('Error updating slot...');

					console.log(`Error: ${err}.`);

					res.status(500).send({
						updatedSlot: null
					});
				}

				return;
			}

			console.log('There must be a data collection trip to another database...');

			res.status(404).send({
				updatedSlot: null
			});
		})
		.delete(async(req: Request, res: Response) => {
			const { columnId, slotId } = req.body;

			if (!columnId || !slotId) {
				res.status(400).send({
					deletedSlot: null
				});

				return;
			}

			if (config.get('nameDB') === MONGO_DB) {
				try {
					const searchColumnEditor = await modelColumn.findById(columnId);

					if (!searchColumnEditor) {
						res.status(404).send({
							deletedSlot: null
						});

						return;
					}

					const searchSlotEditor = await modelSlot.findById(slotId);

					if (!searchSlotEditor) {
						res.status(404).send({
							deletedSlot: null
						});

						return;
					}

					if (searchColumnEditor._id.toString() !== searchSlotEditor.columnId.toString()) {
						res.status(404).send({
							deletedSlot: null
						});

						return;
					}

					const newSlotsIdsForColumn = searchColumnEditor.slots.filter((idSlotMongo) => {
						if (idSlotMongo.toString() === slotId) {
							return false;
						}

						return true;
					});

					// Сначала удаляем id слота из массива колонки, чтобы он не числился там
					// В идеале тут нужны транзакции
					const updatedColumnEditor = await modelColumn.findByIdAndUpdate({ _id: columnId }, { slots: newSlotsIdsForColumn }, { new: true });

					if (!updatedColumnEditor) {
						res.status(404).send({
							deletedSlot: null
						});

						return;
					}

					const deletedSlot = await modelSlot.findOneAndDelete({ _id: slotId });

					if (!deletedSlot) {
						res.status(404).send({
							deletedSlot: null
						});

						return;
					}

					res.status(200).send({
						deletedSlot
					});

				} catch (err: any) {
					console.log('Error delete slot...');

					console.log(`Error: ${err}.`);

					res.status(500).send({
						deletedSlot: null
					});
				}

				return;
			}

			console.log('There must be a data collection trip to another database...');

			res.status(404).send({
				deletedSlot: null
			});
		});

export { routerSlotSlotsEditors };
