import uniqid from 'uniqid';


export default class List {
	constructor() {
		this.items = [];
	}

	addItem(text, count) {
    const item = {
      id: uniqid(),
      text: text,
      count,
      readyToMove: false,
		};
		this.items.push(item);
		return item;
	}

	deleteItem(id) {
		const index = this.getIndex(id);
		this.items.splice(index, 1);
		this.updateItems(index);
	}

	updateItems(startIndex, endIndex = this.items.length) {
    let item;
    for (let i = startIndex; i < endIndex; i++) {
			item = this.items[i];
      item.count = i + 1;
			item.text = item.text;
		}
	}

	moveUp(id) {
		const index = this.getIndex(id);
		if (index !== 0) {
			const item = this.items[index];
			const itemAbove = this.items[index - 1];
			this.items.splice(index - 1, 1, item);
			this.items.splice(index, 1, itemAbove);
      this.updateItems(index - 1, index + 1);
		}
	}

	moveDown(id) {
		const index = this.getIndex(id);
		if (index !== this.items.length - 1) {
			const item = this.items[index];
			const itemBelow = this.items[index + 1];
			this.items.splice(index + 1, 1, item);
			this.items.splice(index, 1, itemBelow);
			this.updateItems(index, index + 2);
		}
	}

	getIndex(id) {
		return this.items.findIndex(el => el.id === id);
	}
}
