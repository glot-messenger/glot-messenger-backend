import { Schema } from 'mongoose';

import {
	SETTINGS_EDITOR_COLLECTION_NAME_DB,
	SLOT_COLLECTION_NAME_DB
} from '../core';

const types = Schema.Types;

const options = {
	accessForChanges: types.Boolean,
	settingId: {
		type: types.ObjectId,
		ref: SETTINGS_EDITOR_COLLECTION_NAME_DB,
		required: true
	},
	slots: [
		{
			type: types.ObjectId,
			ref: SLOT_COLLECTION_NAME_DB,
			required: false
		}
	],
	styles: {
		width: types.String
	}
};

const schemaColumn = new Schema(options, { _id: true });

export { schemaColumn };