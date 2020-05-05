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
  this.bookmarks.push(expandedKey);
  console.log(store.bookmarks);
}

function findAndToggleExpanded(id) {
  //Finds the id for item clicked, and toggles expanded property
  const currentItem = this.findById(id);
  console.log(currentItem);
  currentItem.expanded = !currentItem.expanded;
}

function findAndDelete(id) {
//Finds corresponding id for delete button clicked, and deletes from the store
  this.bookmarks = store.bookmarks = store.bookmarks.filter(currentItem => currentItem.id !== id);
  console.log(store.bookmarks);
}

function findById(id) {
//returns the item in store with matching bookmarks.id
  console.log('findById ran');
  return this.bookmarks.find(currentItem => currentItem.id === id);
}

function setError(error) {
  this.error = error;
}

export default {
  bookmarks: store.bookmarks,
  adding: store.adding,
  filter: store.filter,
  error: store.error,
  addBookmark,
  findAndToggleExpanded,
  findById,
  setError,
  findAndDelete,
};