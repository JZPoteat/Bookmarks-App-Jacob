const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Jake/bookmarks';

function getItems () {
  return fetch(BASE_URL);
}

function createItem(bookmark) {
  console.log('createItem ran');
  console.log(bookmark);
  return apiCall(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: bookmark
  });    
}

function apiCall (url, options) {
  return fetch(url, options)
    .then(res => {
      if (!res.ok) {
        return res.json().then(json => Promise.reject(json))
      }
      return res.json();
    });
}

function deleteItem(id) {
  return apiCall(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  }); 

}

export default {
  getItems,
  createItem,
  deleteItem,
};
