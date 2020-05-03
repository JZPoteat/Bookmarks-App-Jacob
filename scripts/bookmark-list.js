import store from './store.js';
import api from './api.js';

function render() {
  console.log(store.bookmarks);
  console.log("Render Function ran");
  let bookmarks = [...store.bookmarks];
  let html = '';
  if (store.adding) {
    html += generateAddForm();
  }
  else {   
    html += generateBookmarkItemString(bookmarks);  
  }
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
    $('#add-bookmark').removeClass('hidden');
    // toggleStoreAdding();
  });
}
// function toggleStoreAdding() {
//   //This function toggles the store.adding element in our store.  Used for when user interacts with buttons.
//   store.adding = !store.adding; 
//   render();
// }
function handleCancelButton() {
  $('header').on('click','.cancel-button', event => {
    console.log('cancel button clicked');
    $('#add-bookmark').addClass('hidden');
    //toggleStoreAdding();
  });
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
  })
}  


function getItemIdFromElement(item) {
  return $(item).closest('li').data('item-id');
}


function bindEventListeners () {
  console.log('bindEventListeners called');
  handleNewItemSubmit();
  handleAddBookmarkButton();
  handleBookmarkClick();
  handleCancelButton();

}

export default {
  render,
  bindEventListeners,
};
