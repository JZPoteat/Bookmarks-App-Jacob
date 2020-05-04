import store from './store.js';
import api from './api.js';

function render() {
  console.log(store.bookmarks);
  console.log("Render Function ran");
  let bookmarks = [...store.bookmarks];
  let html = '';
  if(store.adding) {
    html += generateAddForm();
  }
  else if (store.filter !== 0) {
    html += generateButtons() + filterByRating(bookmarks);  
  }
  else {
    html += generateButtons() + generateBookmarkItemString(bookmarks);  
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

function handleFilterSelector() {
  $('main').select('.Rating-list', event => {
    const newRating = $('.Rating-list').val();
    store.filter = newRating;
    console.log(store.filter);
    render();
  });
}

function filterByRating(bookmarks) {
  let html = '';
  bookmarks.forEach(item => {
    if(item.rating >= store.filter) {
      html += generateBookmarkElement(item);
    }
  });
  return html;
}

function generateButtons() {
  return `<section class="buttons">
  <button type="button" class="add-button">Add bookmark</button>
  <section class="rating-filter">Filter by:
      <select class="Rating-list">
        <option value='0'>${store.filter}</option>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>   
      </select>
    </section>
</section>`;
}
function handleAddBookmarkButton() {
  $('main').on('click','.add-button', event => {
    console.log("button clicked");
    toggleStoreAdding();
    render();
  });
}

function toggleStoreAdding() {
  store.adding = !store.adding;
}

function handleCancelButton() {
  $('main').on('click','.cancel-button', event => {
    console.log('cancel button clicked');
    clearBookmarkForm();
    toggleStoreAdding();
    render();
  });
}

function clearBookmarkForm () {
  $('.entry-item').val('');
}


function handleNewItemSubmit () {
  console.log('handleNewItemSubmit called');
  $('main').submit('#bookmark-form', function (event) {
    event.preventDefault();
    const newItem = serializeJson($('#bookmark-form')[0]);
    api.createItem(newItem)
      .then(res => res.json())
      .then(item => {
        store.addBookmark(item);
        clearBookmarkForm();
        toggleStoreAdding();
        render();
      });
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
                <li data-item-id=${item.id}>${item.rating}</li>
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
  return `<li class="bookmark-element" data-item-id=${item.id}>${item.title}:   ${item.rating}</li>`;
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

}

export default {
  render,
  bindEventListeners,
};
