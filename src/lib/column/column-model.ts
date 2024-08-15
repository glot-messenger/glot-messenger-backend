class ColumnModel {
	settingId: string;

	_id: number;

	slots: Array<any>;

	styles: any;

	accessForChanges: boolean;

	constructor({ settingId }: any) {
		//this._id = getUniqueId('column');
		this._id = Date.now();
		this.settingId = settingId;
		this.accessForChanges = true;
		this.slots = [];
		this.styles = {
			width: '20%'
		}
	};
};

export { ColumnModel };
