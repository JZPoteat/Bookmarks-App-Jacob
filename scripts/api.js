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
  let error;
  return fetch(url, options)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
  
      return res.json();
    })
    .then(data => {

      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
}

function updateItem(id, updateData) {
  const newData = JSON.stringify(updateData);
  return apiCall(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: newData
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
  updateItem
};
