export const elements = {
  map,
  rightColumn: document.querySelector('.column--right'),
  pointBox: document.querySelector('.points__input-box'),
  inputText: document.querySelector('.points__input'),
  pointsButton: document.querySelector('.points__button'),
  itemsList: document.querySelector('.points__items-list'),
  itemsListBox: document.querySelector('.points__items-list-box')
};

/*
 * LOADER
 */
export const elementString = {
  loader: 'sk-double-bounce'
};

export const loader = {
  element: `<div class='${elementString.loader}'>
              <div class='sk-child sk-double-bounce-1'></div>
              <div class='sk-child sk-double-bounce-2'></div>
            </div>`,

  renderLoader() {
    elements.rightColumn.insertAdjacentHTML('afterbegin', this.element);
  },

  clearLoader() {
    const loader = document.querySelector(`.${elementString.loader}`);
    loader.parentElement.removeChild(loader);
  }
};

/*
 * MAP
 */
const startCoords = [ 53.354174, 83.777556 ];

export const init = () => {
  elements.map = new ymaps.Map('map', {
    center: startCoords,
    zoom: 16,
    controls: [ 'zoomControl', 'fullscreenControl' ]
  });
};

/*
 * POINTS
 */
export const createCollectionMap = () => {
  const collection = new ymaps.GeoObjectCollection({}, {
    preset: 'islands#blackStretchyIcon',
  });
  return collection;
};

export const addPointMap = item => {
  const newPoint = new ymaps.Placemark(
    startCoords,
    {
      iconContent: `${item.count}`,
      balloonContent: setBalloonContent(item.text)
    },
    {
      draggable: true
    }
  );
  newPoint.id = item.id;
  return newPoint;
};

export const addLineStringMap = coords => {
  const lineString = new ymaps.GeoObject({
    geometry: {
      type: 'LineString',
      coordinates: coords
    }
  }, {
      draggable: false,
      strokeColor: '#297acc',
      strokeWidth: 5
    });
  return lineString;
};


export const setBalloonContent = (text, address = 'Адрес не найден...') => {
  const balloonContent = `
        <p class="balloon-content__text">${text}</p>
        <p class="balloon-content__address">${address}</p>`;
  return balloonContent;
};



/*
 * ITEMS
 */
export const renderItem = item => {
  const markup = `
    <div class="item" data-itemid=${item.id} tabindex="0">
      <p class="item__text"><span class="item__count">${item.count}</span> - ${
    item.text
    }</p>
      <button
        type="button"
        id="itemDelete"
        class="item__button--delete"
        disabled="true"
      >
        <svg
          class="button-cross"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="40" />
          <line x1="35" y1="65" x2="65" y2="35" />
          <line x1="35" y1="35" x2="65" y2="65" />
          </svg>
      </button>
    </div>`;
  elements.itemsList.insertAdjacentHTML('beforeend', markup);
};

export const addSlideClass = id => {
  const item = searchItem(id);
  if (!item) return;

  item.classList.add('slide-up');

  const time = durationTime(item);
  setTimeout(() => {
    item.classList.remove('slide-up');
  }, time);
};

export const deleteItem = id => {
  const item = searchItem(id);
  if (!item) return;

  item.classList.add('zoom-in');

  const time = durationTime(item);
  setTimeout(() => {
    item.parentElement.removeChild(item);
  }, time);
  return time
};

export const updateItemsCount = () => {
  const itemsCount = document.querySelectorAll('.item__count');
  return itemsCount;
};

export const searchItem = id => document.querySelector(`[data-itemid=${id}]`);

export const clearInput = () => {
  elements.inputText.value = '';
};

// MOVE ITEM
export const addBackgroundItem = item => {
  item.classList.add('item--active');
};

export const removeBackgroundItem = item => {
  item.classList.remove('item--active');
};

export const startMoveMouse = (item, value) => {
  item.style.top = `${value}px`;
};

export const stopMoveMouse = item => {
  item.removeAttribute('style');
};

export const deleteClone = clone => {
  clone.parentElement.removeChild(clone);
};

export const getCoords = item => {
  const el = item.getBoundingClientRect();
  return {
    top: el.top + pageYOffset,
    bottom: el.bottom + pageYOffset,
    height: el.height,
    width: el.width
  };
};

const durationTime = item =>
  parseFloat(window.getComputedStyle(item, null).animationDuration) * 1000;


