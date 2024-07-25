import { Schema } from 'mongoose';
import { SETTINGS_EDITOR_COLLECTION_NAME_DB } from '../core';

const types = Schema.Types;

const options = {
	_id: types.ObjectId,
	accessForChanges: types.Boolean,
	settingId: {
		type: types.ObjectId,
		ref: SETTINGS_EDITOR_COLLECTION_NAME_DB,
		required: true
	},
	slots: [ types.String ],
	styles: {
		width: types.String
	}
};

const schemaColumn = new Schema(options, { _id: true });

export { schemaColumn };