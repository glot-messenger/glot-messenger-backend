import { Schema } from 'mongoose';

const types = Schema.Types;

const options = {
	_id: types.String,
	timeCreatedInMs: types.Number,
	userId: types.String,
	columns: [ types.String ]
};

const schemaSettingsEditor = new Schema(options, { _id: false });

export { schemaSettingsEditor };
