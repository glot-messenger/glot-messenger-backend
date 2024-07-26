import { Schema } from 'mongoose';
import { COLUMN_COLLECTION_NAME_DB } from '../core';

const types = Schema.Types;

const options = {
   columnId: {
      type: types.ObjectId,
		ref: COLUMN_COLLECTION_NAME_DB,
		required: true
   },
   isEmpty: types.Boolean,
   nameWidget: types.String
};

const schemaSlot = new Schema(options, { _id: true });

export { schemaSlot };
