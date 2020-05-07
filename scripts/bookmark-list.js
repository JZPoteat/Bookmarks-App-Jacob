import store from './store.js';
import api from './api.js';

function render() {
  //renders the DOM
  renderError();
  console.log(store.bookmarks);
  console.log("Render Function ran");
  // let bookmarks = [...store.bookmarks];
  let bookmarks = store.bookmarks.filter(bookmark => {
    return bookmark.rating >= store.filter;
  });
  let html = '';
  if(store.adding) {
    html += generateAddForm();
  }
  //else if (store.filter !== 0) {
  //  $('.button-area').html(`${generateButtons()}`);
  //  html +=filterByRating(bookmarks);  
  //}
  else {
    $('.button-area').html(`${generateButtons()}`);
    html += generateBookmarkItemString(bookmarks);  
  }
  $('main').html(html);  
}

function renderError() {
//Checks to see if the store has an error.  If so, then render html on the page.
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } 
  else {
    $('.error-container').empty();
  }
  console.log('Error:  ' + store.error);
}

function generateAddForm() {
//function returns html to generate the form to submit a new form
  return ` <section class="form-area"><form id="bookmark-form">
<label for="title">Add a New Bookmark:</label>
<input type="text" name="url" class="entry-item" placeholder="http://samplelink.com" required>
<input type="text" name="title" class="entry-item" placeholder="Sample Title" required>
<input type="text" name="rating" class="entry-item" placeholder="Enter a rating (out of 5)" required>
<input type="text" name="desc" class="entry-item" id="description-input" placeholder="Add a description " required>
<section class="form-buttons">
  <button type="button" class="cancel-button">Cancel</button>
  <button type="submit"class="add-item-button">Create</button>
</section>
</form>
</section>`;
}

function filterByRating(bookmarks) {
//Function is called after the user selects a filter, and filters what the user sees in the DOM based on the user's input
  let html = '';
  bookmarks.forEach(item => {
    if(item.rating >= store.filter) {
      html += generateBookmarkElement(item);
    }
  });
  return html;
}

function handleFilterSelector() {
  //Defines an event listener that listens for when the user selects a filter, and changes the DOM appropriately
  $('.button-area').change(function() {
    console.log('filter selector ran');
    const newRating = $('option:selected').val();
    console.log(newRating);
    store.filter = newRating;
    render();
  });
}



function generateButtons() {
//Returns a string of HTML that defines the "Add Bookmark" buttons and the Filter selector
  return `<section class="buttons">
  <button type="button" class="add-button">Add bookmark</button>
  <section class="rating-filter">Filter by:
      <select id="Rating-list">
          ${generateFilterList()}  
      </select>
    </section>
</section>`;
}

function generateFilterList() {
  //function generates the html for the filter list and returns string of HTML
  let html = '';
  for(let i = 0; i <= 5; i++) {
    (i === 0 ? html += `<option value='0'>0</option>` : html += `<option value='${i}'>${i}+</option>` );
  }
  return html;
}
function handleAddBookmarkButton() {
//Defines event listener for when the user clicks the add button, toggles store.adding and renders the page
  $('body').on('click','.add-button', event => {
    console.log("Add button clicked");
    toggleStoreAdding();
    $('.button-area').empty();
    render();
  });
}

function toggleStoreAdding() {
//Toggles store.adding
  store.adding = !store.adding;
}

function handleCancelButton() {
//Defines event listner for the cancel button, clears the form of input, toggles store.adding, and renders the page
  $('main').on('click','.cancel-button', event => {
    console.log('cancel button clicked');
    clearBookmarkForm();
    toggleStoreAdding();
    render();
  });
}

function clearBookmarkForm () {
//Clears entries in the bookmark form
  $('.entry-item').val('');
}


function handleNewItemSubmit () {
//Establishes event listener for submitting the new bookmark.
//Function must convert form entries into Json string, 
  console.log('handleNewItemSubmit called');
  $('main').submit('#bookmark-form', function (event) {
    event.preventDefault();
    const newItem = serializeJson($('#bookmark-form')[0]);
    api.createItem(newItem)
 
      .then(item => {
        store.addBookmark(item);
        clearBookmarkForm();
        toggleStoreAdding();
        render();
      })
      .catch(error => {
        store.setError(error.message);
        renderError();
      });
  });
}

function generateError(message) {
//generates HTML string for error message displayed in the DOM
  return `<section class="error-message">${message}<br>Please click inside the red box and try again.</section>`; 
}

function handleCloseError() {
//removes error statement from the page
  $('.error-container').on('click','.error-message', () => {
    store.setError(null);
    renderError();
  });
}



function serializeJson(form) {
  //Retrieves inputs from the form, converts the Json to string and returns the string.
  const formData = new FormData(form);
  const o = {};
  formData.forEach((val, name) => o[name] = val);
  return JSON.stringify(o);
}


function generateExpandedItem(item) {
//Returns HTML that generates the expanded item.
  return `
              <section class='bookmark-element expanded-item'>
                <li data-item-id=${item.id}>${item.title}</li>
                <li data-item-id=${item.id}>${item.rating}/5</li>
                <li data-item-id=${item.id}>Visit site:  <a href='${item.url}' target='_blank'>${item.url}</a></li>
                <li data-item-id=${item.id}>${item.desc}</li>
                <button type="button" class="delete-button" data-item-id=${item.id}>Delete bookmark</button>
              </section>`;
}
  
function generateBookmarkItemString (bookmarkList) {
//Provides logic for generating string of expanded and condensed bookmark elements
  let html = '';
  bookmarkList.forEach((item) => {
    if (item.expanded) {
      console.log('generating expanded')
      html += generateExpandedItem(item);
    }
    else {

      html += generateBookmarkElement(item);
    }
  });
  return html;
}
  
function generateBookmarkElement(item) {
//Generates one condensed bookmark element
  return `<li class="bookmark-element" data-item-id=${item.id}>${item.title}:   ${item.rating}/5</li>`;
}

function handleBookmarkClick() {
//Event listener for Toggling the expanded and condensed view
  $('main').on('click', 'li', event => {
    console.log('li item clicked!');
    const id = getItemIdFromElement(event.currentTarget);
    const currItem = store.findById(id);
    const newData = { expanded: !currItem.expanded};
    console.log(event.currentTarget);
    console.log(id);
    store.findAndToggleExpanded(id, newData);
    render();
  });
}  

function handleDeleteItemClicked () {
//Event listener for when the delete button is clicked.  It must make call to api, and change store.bookmarks
  $('main').on('click','.delete-button', event => {
    console.log('delete button clicked');
    const id = getItemIdFromDeleteButton(event.currentTarget);
    console.log(id);
    api.deleteItem(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(error => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
}

function getItemIdFromElement(item) {
//Gets data-item-id from closest li element
  return $(item).closest('li').data('item-id');
}

function getItemIdFromDeleteButton(item) {
//Gets data-item-id stored on delete button
  return $(item).closest('.delete-button').data('item-id');
}

function bindEventListeners () {
  console.log('bindEventListeners called');
  handleNewItemSubmit();
  handleAddBookmarkButton();
  handleBookmarkClick();
  handleCancelButton();
  handleDeleteItemClicked();
  handleFilterSelector();
  handleCloseError();

}

export default {
  render,
  bindEventListeners,
};
