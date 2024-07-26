import { model } from 'mongoose';
import { schemaSlot } from '../schemas';
import { SLOT_COLLECTION_NAME_DB } from '../core';

const modelSlot = model(SLOT_COLLECTION_NAME_DB, schemaSlot);

export { modelSlot };
