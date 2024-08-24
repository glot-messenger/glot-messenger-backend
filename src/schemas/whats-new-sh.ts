import { Schema } from 'mongoose';

const types = Schema.Types;

const options = {
	timeCreatedInMs: types.Number,
	image: {
		name: types.String,
		alt: types.String
	},
	title: types.String,
	icon: {
		name: types.String,
		alt: types.String
	},
	lists: [
		{
			_id: false,
			title: types.String,
			elements: [
				{
					_id: false,
					text: types.String,
					links: [
						{
							_id: false,
							path: types.String,
							titleHover: types.String,
							targetValue: types.String
						}
					]
				}
			]
		}
	]
};

const schemaWhatsNew = new Schema(options, { _id: true });

export { schemaWhatsNew };
