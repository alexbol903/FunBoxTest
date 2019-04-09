import { expect } from 'chai';
import List from '../Model';

const createList = addItems => {
  const newList = new List();
  let i = 1;
  while (i <= addItems) {
    newList.addItem(`New text ${i}`, i);
    i++;
  }
  return newList;
}

describe('Model: add new 5 item', () => {
  const list = createList(5);

  it('List length should be 5', () => {
    expect(list.items).to.have.lengthOf(5);
  });
  it('Item 2 - id should be string', () => {
    expect(list.items[ 1 ].id).to.be.a('string');
  });
  it('Item 2 - text should be string and equal New text 2', () => {
    expect(list.items[ 1 ].text).to.be.a('string').to.equal('New text 2')
  });
  it('Item 2 - count should be number and equal 2', () => {
    expect(list.items[ 1 ].count).to.be.a('number').to.equal(2);
  });
  it('Item 2 - readyToMove should be false', () => {
    expect(list.items[ 1 ].readyToMove).to.be.false;
  });
});

describe('Model: List have 4 Items after delete the Item 3', () => {
  const list = createList(5);

  before(() => {
    list.deleteItem(list.items[ 2 ].id);
  });

  it('List length should be 4', () => {
    expect(list.items).to.have.lengthOf(4);
  });
  it('Item 2 text should be New text 2', () => {
    expect(list.items[ 1 ].text).to.equal('New text 2');
  });
  it('Item 2 count should be 2', () => {
    expect(list.items[ 1 ].count).to.equal(2);
  });
  it('Item 3 text should be New text 4', () => {
    expect(list.items[ 2 ].text).to.equal('New text 4');
  });
  it('Item 3 count should be 3', () => {
    expect(list.items[ 2 ].count).to.equal(3);
  });
  it('Last Item text should be New text 5', () => {
    expect(list.items[ 3 ].text).to.equal('New text 5');
  });
  it('Last Item count should be 4', () => {
    expect(list.items[ 3 ].count).to.equal(4);
  });
});

describe('Model: Move Item 2 to Up on 1 step', () => {
  const list = createList(3);

  before(() => {
    list.moveUp(list.items[ 1 ].id);
  });
  
  it('Item 1 text should be a New text 2 and count equal 1', () => {
    expect(list.items[ 0 ]).to.have.property('text', 'New text 2');
    expect(list.items[ 0 ]).to.have.property('count', 1);
  });
  it('Item 2 text should be a New text 1 and count equal 2', () => {
    expect(list.items[ 1 ]).to.have.property('text', 'New text 1');
    expect(list.items[ 1 ]).to.have.property('count', 2);
  });
  it('Item 3 text should be a New text 3 and count equal 3', () => {
    expect(list.items[ 2 ]).to.have.property('text', 'New text 3');
    expect(list.items[ 2 ]).to.have.property('count', 3);
  });

});

describe('Model: Move Item 1 to Down on 1 step', () => {
  const list = createList(3);

  before(() => {
    list.moveDown(list.items[ 0 ].id);
  });
  
  it('Item 1 text should be a New text 2 and count equal 1', () => {
    expect(list.items[ 0 ]).to.have.property('text', 'New text 2');
    expect(list.items[ 0 ]).to.have.property('count', 1);
  });
  it('Item 2 text should be a New text 1 and count equal 2', () => {
    expect(list.items[ 1 ]).to.have.property('text', 'New text 1');
    expect(list.items[ 1 ]).to.have.property('count', 2);
  });
  it('Item 3 text should be a New text 3 and count equal 3', () => {
    expect(list.items[ 2 ]).to.have.property('text', 'New text 3');
    expect(list.items[ 2 ]).to.have.property('count', 3);
  });
});
