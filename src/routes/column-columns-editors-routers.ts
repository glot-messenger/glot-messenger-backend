import express, { Request, Response } from 'express';
import { getEndSegmentForUrlDataBase } from '../utils';
import config from 'config';
import { ColumnModel } from '../lib';

import {
	modelColumn,
	modelSettingsEditor
} from '../models';

import {
	FIREBASE,
	MONGO_DB,
	END_POINT_COLUMNS_EDITORS
} from '../core';

const routerColumnColumnsEditors = express.Router({ mergeParams: true });

routerColumnColumnsEditors
	.route('/')
		.post(async(req: Request, res: Response) => {
			const { settingId, data } = req.body;

			if (!settingId) {
				res.status(400).send({
					newColumnInEditor: null
				});

				return;
			}

			let dataNewColumn = data;

			if (!dataNewColumn) {
				dataNewColumn = new ColumnModel({ settingId });
			}

			if (config.get('nameDB') === FIREBASE) {
				const baseUrlColumnColumnsEditors: string = getEndSegmentForUrlDataBase(config.get('urlDB') + END_POINT_COLUMNS_EDITORS + `/${dataNewColumn._id}`);

				const responseColumnColumnsEditors = await fetch(baseUrlColumnColumnsEditors, {
					method: 'PUT',
					body: JSON.stringify(dataNewColumn)
				});

				const dataColumnColumnsEditors = await responseColumnColumnsEditors.json();

				// firebase в данный момент не создает ключ, если в нем пустое значение slots нет, посмотреть что можно сделать
				// добавить колонку в массив настроек редактора и вернуть правильно значение клиенту
				console.log('1111', dataColumnColumnsEditors);

				res.status(404).send({
					newColumnInEditor: null
				});

				return;
			}

			if (config.get('nameDB') === MONGO_DB) {
				try {
					delete dataNewColumn['_id'];

					const settingsEditorData = await modelSettingsEditor.findOne({ _id: settingId });

					// Если настроек редактора таких нет в базе, то значит что-то не то передали
					if (!settingsEditorData) {
						res.status(404).send({
							newColumnInEditor: null
						});

						return;
					}

					const newColumn = await modelColumn.create(dataNewColumn);

					const newSettingsEditor = await modelSettingsEditor.findByIdAndUpdate({ _id: settingId }, { columns: [...settingsEditorData.columns, newColumn._id] }, { new: true });

					// Если при нахождении настроек редактора и добавлении нового id в поле columns опять что-то было не так найдено, то колонка удаляется из базы и ответ не успешный
					if (!newSettingsEditor) {
						await modelColumn.findOneAndDelete({ _id: newColumn._id.toString() });

						res.status(404).send({
							newColumnInEditor: null
						});

						return;
					}

					res.status(200).send({
						newColumnInEditor: newColumn
					});

				} catch (err: any) {
					console.log('Error when adding new column...');

					console.log(`Error: ${err}.`);

					res.status(500).send({
						newColumnInEditor: null
					});
				}

				return;
			}

			console.log('There must be a data collection trip to another database...');

			res.status(404).send({
				newColumnInEditor: null
			});
		});

routerColumnColumnsEditors
	.route('/:id')
		.patch(async(req: Request, res: Response) => {
			const { columnId, value } = req.body;

			if (!columnId || Array.isArray(value) || !(value instanceof Object)) {
				res.status(400).send({
					updatedColumn: null
				});

				return;
			}

			if (config.get('nameDB') === MONGO_DB) {
				try {
					const searchColumn = await modelColumn.findById(columnId);

					if (!searchColumn) {
						res.status(404).send({
							updatedColumn: null
						});

						return;
					}

					const id = searchColumn['_id'];

					const updatedColumn = await modelColumn.findByIdAndUpdate({ _id: columnId }, { ...value, _id: id }, { new: true });

					if (!updatedColumn) {
						res.status(404).send({
							updatedColumn: null
						});

						return;
					}

					res.status(200).send({
						updatedColumn
					});

				} catch (err: any) {
					console.log('Error updating column...');

					console.log(`Error: ${err}.`);

					res.status(500).send({
						updatedColumn: null
					});
				}

				return;
			}

			console.log('There must be a data collection trip to another database...');

			res.status(404).send({
				updatedColumn: null
			});
		});

export { routerColumnColumnsEditors };