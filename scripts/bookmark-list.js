import store from './store.js';
import api from './api.js';

function render() {
  //renders the DOM
  console.log(store.bookmarks);
  console.log("Render Function ran");
  let bookmarks = [...store.bookmarks];
  let html = '';
  if(store.adding) {
    html += generateAddForm();
  }
  else if (store.filter !== 0) {
    $('.button-area').html(`${generateButtons()}`);
    html +=filterByRating(bookmarks);  
  }
  else {
    $('.button-area').html(`${generateButtons()}`);
    html += generateBookmarkItemString(bookmarks);  
  }
  $('main').html(html);  
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
  $('.button-area').change( function() {
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
  $('.button-area').on('click','.add-button', event => {
    console.log("button clicked");
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
        $('main').prepend(generateError(error.message));
        console.error(error);
      });
  });
}

function generateError(message) {
//generates HTML required for 
  return `<p class="error-container">${message}<br>Please try again.</p>`;
}

function handleCloseError() {
//removes error statement from the page
  $('main').on('click','.error-container', () => {
    $('.error-container').empty();
  });
}

function serializeJson(form) {
  const formData = new FormData(form);
  const o = {};
  formData.forEach((val, name) => o[name] = val);
  return JSON.stringify(o);
}


function generateExpandedItem(item) {
  return `<section class='bookmark-element expanded-item'>
                <li data-item-id=${item.id}>${item.title}</li>
                <li data-item-id=${item.id}>${item.rating}/5</li>
                <li data-item-id=${item.id}><a href='${item.url}' target='_blank'>${item.url}</a></li>
                <li data-item-id=${item.id}>${item.desc}</li>
                <button type="button" class="delete-button" data-item-id=${item.id}>Delete bookmark</button>
              </section>`;
}
  
function generateBookmarkItemString (bookmarkList) {
  let html = '';
  bookmarkList.forEach((item) => {
    if (item.expanded) {
      html += generateExpandedItem(item);
    }
    else {

      html += generateBookmarkElement(item);
    }
  });
  return html;
}
  
function generateBookmarkElement(item) {
  return `<li class="bookmark-element" data-item-id=${item.id}>${item.title}:   ${item.rating}/5</li>`;
}

function handleBookmarkClick() {
  $('main').on('click', 'li', event => {
    console.log('li item clicked!');
    const id = getItemIdFromElement(event.currentTarget);
    console.log(event.currentTarget);
    console.log(id);
    store.findAndToggleExpanded(id);
    render();
  });
}  

function handleDeleteItemClicked () {
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
        $('main').prepend(generateError(error.message));
        console.error(error);
      });
  });
}



function getItemIdFromElement(item) {
  return $(item).closest('li').data('item-id');
}

function getItemIdFromDeleteButton(item) {
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
