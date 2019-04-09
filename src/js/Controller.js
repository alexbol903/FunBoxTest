import List from './Model';
import * as View from './View';

const state = {};

/**
 * MAP CONTROLLER
 */
const controlMap = async () => {
  try {
    View.loader.renderLoader();
    await ymaps.ready(View.init);
    setTimeout(() => {
      View.loader.clearLoader();
      View.elements.pointsButton.disabled = false;
    }, 500);
  } catch (error) {
    alert(error);
  }
};

controlMap();

/**
 * LIST CONTROLLER
 */
const controlList = () => {
  if (!state.list) state.list = new List();

  const text = View.elements.inputText.value;
  const count = state.list.items.length + 1;
  const reg = /\S/;

  if (!text.match(reg)) return;

  const item = state.list.addItem(text, count);
  View.renderItem(item);
  View.addSlideClass(item.id);
  return { element: View.searchItem(item.id), item: item };
};

const uptateList = () => {
  state.list.items.forEach((el, i) => {
    const itemsCount = View.updateItemsCount();
    itemsCount[ i ].textContent = el.count;
  });
  updatePointMap();
};

/**
 * ITEMS CONTROLLER
 */
const addItem = () => {
  const list = controlList();
  if (!list) return;
  View.clearInput();
  View.elements.inputText.focus();
  addPointMap(list.item);
  addScrollItem(list.element);
  console.log(state.list.items);
};

const deleteItem = event => {
  const btnDel = event.target.closest('.item__button--delete');
  if (!btnDel) return;

  const id = event.target.closest('.item').dataset.itemid;
  state.list.deleteItem(id);
  const time = View.deleteItem(id);
  setTimeout(() => {
    deletePointMap(id);
    uptateList();
    if (!state.list.items.length) delete state.list;
  }, time);
};

/**
 * MOVE CONTROLLER
 */
// Element ready to move
const mouseDownItem = event => {
  if (event.which != 1 && !shiftKeyCode(event)) return;

  const item = event.target.closest('.item');
  const btnDel = event.target.closest('.item__button--delete');
  if (!item || btnDel) return;

  state.element = {};
  state.element.item = item;
  state.element.coordItem = View.getCoords(item);
  state.element.posY = event.pageY - state.element.coordItem.top;

  item.readyToMove = true;
  View.addBackgroundItem(item);
  item.focus();

  if (!shiftKeyCode(event)) {
    document.onmouseup = mouseUpItem;
    View.elements.itemsList.onmousemove = mouseMoveItem;
  }
};

// Element don't readyness to move
const mouseUpItem = event => {
  if (!state.element.item) return;

  const item = state.element.item;
  item.readyToMove = false;
  View.removeBackgroundItem(item);
  View.stopMoveMouse(state.element.item);

  if (state.element.clone) {
    View.deleteClone(state.element.clone);
    item.focus();
  }
  if (!shiftKeyCode(event)) {
    document.onmouseup = null;
    View.elements.itemsList.onmousemove = null;
  }

  delete state.element;
};

const mouseMoveItem = event => {
  const item = state.element.item;
  if (!state.element.clone) createCloneItem(item);
  const clone = state.element.clone;
  const coordList = View.getCoords(View.elements.itemsList);

  const value = event.pageY - state.element.posY - coordList.top;

  View.startMoveMouse(state.element.clone, value);

  const coordClone = View.getCoords(clone);
  const coordItem = View.getCoords(item);

  if (coordClone.bottom < coordItem.top) {
    moveItemUp(item);
  } else if (coordClone.top > coordItem.bottom) {
    moveItemDown(item);
  }
  clone.textContent = item.textContent;
  moveScrollItem(event.clientY, value);
};

const createCloneItem = item => {
  const clone = item.cloneNode(true);
  state.element.clone = clone;

  item.style.visibility = 'hidden';
  item.parentElement.appendChild(clone);

  clone.style.width = state.element.coordItem.width + 'px';
  clone.style.userSelect = 'none';
  clone.style.position = 'absolute';
};

const onKeydownItem = event => {
  const item = state.element.item;
  if (!(item && item.readyToMove)) return;

  if (event.keyCode === 38) {
    moveItemUp(item);
  } else if (event.keyCode === 40) {
    moveItemDown(item);
  }
};

const moveItemUp = item => {
  const previousItem = item.previousElementSibling;
  if (previousItem) {
    state.list.moveUp(item.dataset.itemid);
    item.parentElement.insertBefore(item, previousItem).focus();
    uptateList();
    console.log(state.list.items);

  }
};

const moveItemDown = item => {
  const nextItem = item.nextElementSibling;
  if (nextItem) {
    item.parentElement.insertBefore(item, nextItem.nextElementSibling).focus();
  } else {
    item.parentElement.insertBefore(item, null).focus();
  }
  state.list.moveDown(item.dataset.itemid);
  uptateList();
  console.log(state.list.items);

};

/**
 * SCROLL CONTROLLER
 */
const addScrollItem = item => {
  if (!item) return;

  const coordItem = item.getBoundingClientRect();
  const listBoxHeight = View.elements.itemsListBox.clientHeight;
  const listHeight = View.elements.itemsList.clientHeight;

  if (listBoxHeight === listHeight) return;
  View.elements.itemsListBox.scrollTop += coordItem.height + 15;
};

const moveScrollItem = clientY => {
  if (!clientY) return;

  const listBoxTop = View.elements.itemsListBox.offsetTop;
  const listBoxBottom =
    View.elements.itemsListBox.offsetTop +
    View.elements.itemsListBox.clientHeight;
  const percentOfListHeight = listBoxBottom * 0.2;
  const step = 7;

  if (clientY < listBoxTop + percentOfListHeight) {
    View.elements.itemsListBox.scrollTop -= step;
  } else if (clientY > listBoxBottom - percentOfListHeight) {
    View.elements.itemsListBox.scrollTop += step;
  }
};

/**
 * EVENTS
 */

View.elements.pointsButton.onclick = addItem;
View.elements.pointBox.addEventListener('keydown', event => {
  if (event.keyCode !== 13) return;
  addItem(event);
});

View.elements.itemsList.onclick = deleteItem;

View.elements.itemsList.onmousedown = mouseDownItem;

View.elements.itemsList.onkeydown = event => {
  if (shiftKeyCode(event)) {
    mouseDownItem(event);
  } else if (event.keyCode === 38 || event.keyCode === 40) {
    onKeydownItem(event);
  }
};

View.elements.itemsList.onkeyup = event => {
  if (!shiftKeyCode(event)) return;
  mouseUpItem(event);
};

const shiftKeyCode = event => event.keyCode === 16;


/**
 * POINTS
 */
const addPointMap = item => {
  if (!state.pointCollection) {
    const geoCollection = View.createCollectionMap();
    state.pointCollection = geoCollection;
  }

  const newPoint = View.addPointMap(item);
  const geoObjects = View.elements.map.geoObjects;
  state.pointCollection.add(newPoint);
  
  if (state.pointCollection.getLength() > 1) {
    updateLineStringCoords();
  }
  
  geoObjects.add(state.pointCollection);
  
  newPoint.events.add('dragend', updatePointMap);
};

const updateLineStringCoords = () => {
  const geoObjects = View.elements.map.geoObjects;  
  geoObjects.remove(state.LineString);
  const lineString = View.addLineStringMap(getCoordsPoints());
  state.LineString = lineString;
  geoObjects.add(state.LineString)  
};

const getCoordsPoints = () => {
  const coords = [];
  state.pointCollection.each(el => {
    coords.push(el.geometry.getCoordinates());
  });
  return coords;
};


const deletePointMap = id => {
  const pointCollection = state.pointCollection;
  pointCollection.each(el => {
    if (el.id === id) pointCollection.remove(el)
  });
  updateLineStringCoords();
  if (!pointCollection.getLength()) delete state.pointCollection;
};

const updatePointMap = () => {
  if (!state.pointCollection) return;
  const pointCollection = state.pointCollection;
  const listItems = state.list.items;
  let address;

  pointCollection.each(async (el, index) => {
    el.id = listItems[index].id;
    el.properties.set('iconContent', listItems[ index ].count);
    address = await getAddressPoint(el, index);
    el.properties.set('balloonContent', View.setBalloonContent(listItems[ index ].text, address));
    pointCollection.add(el, index);
  });
  updateLineStringCoords();
};

const getAddressPoint = async (el, index) => {
  const point = el;
  let address;
  const coords = point.geometry.getCoordinates();
  await ymaps.geocode(coords, { kind: 'house', results: state.pointCollection.getLength()}).then(res => {
    const firstGeoObject = res.geoObjects.get(index);
    address = firstGeoObject.getAddressLine();
  });
  return address;
};