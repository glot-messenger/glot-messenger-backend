import { model } from 'mongoose';
import { schemaColumn } from '../schemas';
import { COLUMN_COLLECTION_NAME_DB } from '../core';

const modelColumn = model(COLUMN_COLLECTION_NAME_DB, schemaColumn);

export { modelColumn };