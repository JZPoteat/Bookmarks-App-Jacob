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
        // if response is not 2xx, start building error object
        error = { code: res.status };
  
        // if response is not JSON type, place statusText in error object and
        // immediately reject promise
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
  
      // otherwise, return parsed JSON
      return res.json();
    })
    .then(data => {
      // if error exists, place the JSON message into the error object and 
      // reject the Promise with your error object so it lands in the next 
      // catch.  IMPORTANT: Check how the API sends errors -- not all APIs
      // will respond with a JSON object containing message key
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
  
      // otherwise, return the json as normal resolved Promise
      return data;
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
