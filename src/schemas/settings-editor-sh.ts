import { Schema } from 'mongoose';

import {
	ACCOUNT_COLLECTION_NAME_DB,
	COLUMN_COLLECTION_NAME_DB
} from '../core';

const types = Schema.Types;

const options = {
	_id: types.ObjectId,
	timeCreatedInMs: types.Number,
	userId: {
		type: types.ObjectId,
		ref: ACCOUNT_COLLECTION_NAME_DB,
		required: true
	},
	columns: [
		{
			type: types.ObjectId,
			ref: COLUMN_COLLECTION_NAME_DB,
			required: false
		}
	]
};

const schemaSettingsEditor = new Schema(options, { _id: true });

export { schemaSettingsEditor };
