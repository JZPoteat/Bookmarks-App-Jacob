const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Jake/bookmarks';

function getItems () {
  return fetch(BASE_URL);
}

function createItem(bookmark) {
  console.log('createItem ran');
  console.log(bookmark);
  return fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: bookmark
  });
}

function deleteItem(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  }); 

}

export default {
  getItems,
  createItem,
  deleteItem,
};
