class SlotModel {
   _id: number;

   columnId: string;

   isEmpty: boolean;

	nameWidget: string;

   constructor({ columnId }: any) {
      // this._id = getUniqueId('slot');
		this._id = Date.now();
      this.columnId = columnId;
      this.isEmpty = true;
		this.nameWidget = '';
   };
};

export { SlotModel };
