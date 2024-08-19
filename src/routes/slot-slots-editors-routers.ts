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

export { routerSlotSlotsEditors };
