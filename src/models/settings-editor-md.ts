import { model } from 'mongoose';
import { schemaSettingsEditor } from '../schemas';
import { SETTINGS_EDITOR_COLLECTION_NAME_DB } from '../core';

const modelSettingsEditor = model(SETTINGS_EDITOR_COLLECTION_NAME_DB, schemaSettingsEditor);

export { modelSettingsEditor };
