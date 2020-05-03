import api from './api.js';
import store from './store.js';
import bookmarkList from './bookmark-list.js';

const testItem = {
  title: 'google',
  url: 'https://google.com',
  desc: 'google page',
  rating: 5
}
function main() {
  api.getItems()
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addBookmark(item));
      bookmarkList.render();
    });
  bookmarkList.bindEventListeners();
  bookmarkList.render();
}

$(main);

//Next time:
//Figure out how to toggle the form appearing on the screen.  
//It works to add button, but if you want to cancel, the add button no longer works.
