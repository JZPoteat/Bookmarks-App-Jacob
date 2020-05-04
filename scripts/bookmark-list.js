import store from './store.js';
import api from './api.js';

function render() {
  console.log(store.bookmarks);
  console.log("Render Function ran");
  let bookmarks = [...store.bookmarks];
  let html = generateBookmarkItemString(bookmarks);  
  $('main').html(html);  
}

function generateAddForm() {
//function returns html to generate the form to submit a new form
  return ` <section class="form-area"><form id="bookmark-form">
<label for="title">Add a New Bookmark</label>
<input type="text" name="url" class="entry-item" placeholder="http://samplelink.com" required>
<input type="text" name="title" class="entry-item" placeholder="Sample Title" required>
<input type="text" name="rating" class="entry-item" placeholder="Enter a rating (out of 5)" required>
<input type="text" name="desc" class="entry-item" placeholder="Add a description " required>
<button type="button" class="cancel-button">Cancel</button>
<button type="submit"class="add-item-button">Create</button>
</form>
</section>`;
}
function handleAddBookmarkButton() {
  $('header').on('click','.add-button', event => {
    console.log("button clicked");
    removeClassHidden();
    
    // toggleStoreAdding();
  });
}

function removeClassHidden() {
  $('#add-bookmark').removeClass('hidden');
}


function addClassHidden() {
  $('#add-bookmark').addClass('hidden');
}

function handleCancelButton() {
  $('header').on('click','.cancel-button', event => {
    console.log('cancel button clicked');
    clearBookmarkForm();
    addClassHidden();
  });
}

function clearBookmarkForm () {
  $('.entry-item').val('');
}


function handleNewItemSubmit () {
  console.log('handleNewItemSubmit called');
  $('#bookmark-form').submit(function (event) {
    event.preventDefault();
    const newItem = serializeJson($('#bookmark-form')[0]);
    api.createItem(newItem)
      .then(res => res.json())
      .then(item => {
        store.addBookmark(item);
        clearBookmarkForm();
        addClassHidden();
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
  return `<section class='expanded-item'>
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
      .then(res => res.json())
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

}

export default {
  render,
  bindEventListeners,
};
