import express, { Request, Response } from 'express';
import { getEndSegmentForUrlDataBase } from '../utils';
import config from 'config';
import { ColumnModel } from '../lib';

import {
	modelColumn,
	modelSettingsEditor,
	modelSlot
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
		})
		.delete(async(req: Request, res: Response) => {
			const { columnId, settingId, value } = req.body;

			if (!columnId || !settingId) {
				res.status(400).send({
					deletedColumn: null
				});

				return;
			}

			if (config.get('nameDB') === MONGO_DB) {
				try {
					const searchSettingsEditor = await modelSettingsEditor.findById(settingId);

					// Для успешного завершения операции нам важно, чтобы переданные на сервер данные были коррекнтыми, если с settingId что-то не так, мы прерываем операцию, т.к. запрос некорректный
					if (!searchSettingsEditor) {
						res.status(404).send({
							deletedColumn: null
						});

						return;
					}

					const searchColumn = await modelColumn.findById(columnId);

					// Для успешного завершения операции нам важно, чтобы переданные на сервер данные были коррекнтыми, если с columnId что-то не так, мы прерываем операцию, т.к. запрос некорректный
					if (!searchColumn) {
						res.status(404).send({
							deletedColumn: null
						});

						return;
					}

					// По-хорошему тут должны быть ниже реализованы транзакции, если хоть одна операция с манипуляцией базы даст ошибку, то все должно вернуться к исходному виду
					// В случае, даже если какие-то слоты колонки будут не удалены и повиснут в базе, мы не прерываем операцию, т.к. в наших же интересах удалить у пользователя эту некорректную колонку, в которой числятся какие-то слоты, которые не были найдены в базе, ну или наш сервер баганул в момент поиска слота и его удаления (это уже наша проблема), поэтому операция продолжается
					// Все мертвые слоты, которые могут числиться в БД уже потом будут удаляться специальными нашими коллекторами, которые будут следить, когда данные в последний раз запрашивались, если они давно не запрашивались, значит можно их смело сносить, скорее всего это мертвые данные
					let arrayPromisesForDeleteSlots = [];

					for (let m = 0; m < searchColumn.slots.length; m++) {
						const pr = modelSlot.findOneAndDelete({ _id: searchColumn.slots[m].toString() }).exec();

						arrayPromisesForDeleteSlots.push(pr);
					}

					await Promise.all(arrayPromisesForDeleteSlots);

					const newColumnsValueForSettingsEditor = searchSettingsEditor.columns.filter((idColumnMongo) => {
						if (idColumnMongo.toString() === columnId) {
							return false;
						}

						return true;
					});

					// Изначально мы обновляем поле columns настроек редактора для пользователя, это важно, т.к. если мы удалим в первую очередь саму колонку, а потом начнем обновлять это поле и будет ошибка, у пользоавателя будет числиться id удаленной колонки и клиент не сможет нормально отрисоваться
					// В наших интересах сначала обновить поле, а уже потом колонку, даже если потом колонка не удалится, она будет числиться в БД мертвым грузом, и это будет проблема уже наших сервисов но нахождению такого мусора
					const updatedSettingsEditor = await modelSettingsEditor.findByIdAndUpdate({ _id: settingId }, { columns: newColumnsValueForSettingsEditor }, { new: true });

					if (!updatedSettingsEditor) {
						res.status(404).send({
							deletedColumn: null
						});

						return;
					}

					// Тут есть косяк с тем, что если поле columns не было обновлено у settingsEditor, а слоты то мы уже поудаляли для колонки, то при обновлении страницы на клиенте слоты не смогут быть корректно отрисованы, т.к. в базе их уже нет
					// Решают все эти проблемы транзакции на сервере
					const deletedColumn = await modelColumn.findOneAndDelete({ _id: columnId });

					if (!deletedColumn) {
						res.status(404).send({
							deletedColumn: null
						});

						return;
					}

					res.status(200).send({
						deletedColumn
					});

				} catch (err: any) {
					console.log('Error delete column...');

					console.log(`Error: ${err}.`);

					res.status(500).send({
						deletedColumn: null
					});
				}

				return;
			}

			console.log('There must be a data collection trip to another database...');

			res.status(404).send({
				deletedColumn: null
			});
		});

export { routerColumnColumnsEditors };