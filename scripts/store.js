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
}


export default {
  bookmarks: store.bookmarks,
  addBookmark,
};