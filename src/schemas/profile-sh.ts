import { Schema } from 'mongoose';

import {
	STATUSE_COLLECTION_NAME_DB,
	ACCOUNT_COLLECTION_NAME_DB
} from '../core';

const types = Schema.Types;

const options = {
	userName: types.String,
	userLastName: types.String,
	note: types.String,
	imageName: types.String,
	colorForCap: types.String,
	accountId: {
		type: types.ObjectId,
		ref: ACCOUNT_COLLECTION_NAME_DB,
		required: true
	},
	status: {
		type: types.ObjectId,
		ref: STATUSE_COLLECTION_NAME_DB,
		required: true
	},
	isMain: types.Boolean
};

const schemaProfile = new Schema(options, { _id: true });

export { schemaProfile };
