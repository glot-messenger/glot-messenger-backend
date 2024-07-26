import mongoose from 'mongoose';
import settingsEditorsMock from './mock-data/settings-editors.json';
import accountsMock from './mock-data/accounts.json';
import columnsMock from './mock-data/columns.json';
import slotsMock from './mock-data/slots.json';

import {
	modelSettingsEditor,
	modelAccount,
	modelColumn,
	modelSlot
} from './models';

async function initializationDB(): Promise<void> {
	try {
		const accountsCollectionName = modelAccount.collection.collectionName; // имя конкретной коллекции
		const settingsEditorsCollectionName = modelSettingsEditor.collection.collectionName;
		const columnsCollectionName = modelColumn.collection.collectionName;
		const slotsCollectionName = modelSlot.collection.collectionName;

		const columnsListDoc = await modelColumn.find();
		const settingsEditorsListDoc = await modelSettingsEditor.find();
		const accountsListDoc = await modelAccount.find();
		const slotsListDoc = await modelSlot.find();

		if (slotsListDoc.length < slotsMock.length) { // если в базе данных менше чем в моке, значит надо записать моками
			writeToDB(slotsCollectionName, slotsMock, modelSlot);
		}

		if (columnsListDoc.length < columnsMock.length) {
			writeToDB(columnsCollectionName, columnsMock, modelColumn);
		}

		if (accountsListDoc.length < accountsMock.length) {
			writeToDB(accountsCollectionName, accountsMock, modelAccount);
		}

		if (settingsEditorsListDoc.length < settingsEditorsMock.length) {
			writeToDB(settingsEditorsCollectionName, settingsEditorsMock, modelSettingsEditor);
		}

	} catch (err: any) {
		console.log(`Error:`, err);

		console.log('An error occurred while initializing the database.');

		throw new Error('Error: initializationDB fn.');
	}
};

async function writeToDB(nameCollection: string, mockData: any[], model: any) {
	try {
		await mongoose.connection.dropCollection(nameCollection); // полностью очищаем коллекцию

		const arr = [];

		if (mockData.length) {
			for(let m = 0; m < mockData.length; m++) {
				const element: any = { ...mockData[m] };

				// delete element._id;

				const doc = new model(element); // создаем документ монги на модель

				arr.push(doc.save()); // сохраняем документ
			};

		} else {
			arr.push(model.createCollection());
		}

		await Promise.all(arr); // обрабатываем все промисы сохранения документов

	} catch (err) {
		console.log(err, 'ERROR');

		console.log(`There is an error in the database record function. Name Collection - ${nameCollection}.`);

		throw new Error('error writeToDB fn.');
	}
};

export { initializationDB };
