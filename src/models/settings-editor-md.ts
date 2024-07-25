import { model } from 'mongoose';
import { schemaSettingsEditor } from '../schemas';

const modelSettingsEditor = model('SettingsEditor', schemaSettingsEditor);

export { modelSettingsEditor };
