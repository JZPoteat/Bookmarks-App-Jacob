const store = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0
};

function addBookmark(item) {
  //function pushes bookmark to the store, which maintains the current store of our bookmarks in the DOM
  const expandedKey = {expanded: false};
  Object.assign(expandedKey, item);
  store.bookmarks.push(expandedKey);
  console.log(store.bookmarks);
}

function findAndToggleExpanded(id) {
  const currentItem = findById(id);
  console.log(currentItem);
  currentItem.expanded = !currentItem.expanded;
}

function findAndDelete(id) {
  store.bookmarks = store.bookmarks.filter(currentItem => currentItem.id !== id);
  console.log(store.bookmarks);
}

function findById(id) {
  console.log('findById ran');
  return store.bookmarks.find(currentItem => currentItem.id === id);
}

export default {
  bookmarks: store.bookmarks,
  addBookmark,
  findAndToggleExpanded,
  findById,
  findAndDelete
};