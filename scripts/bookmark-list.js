import store from './store.js';
import api from './api.js';

function render() {
  console.log(store.bookmarks);
  console.log("hello World");
  let bookmarks = [...store.bookmarks];
  let html = '';
  if (store.adding) {
    html += generateAddForm();
  }
  else {   
    html += generateButtons() + generateBookmarkItemString(bookmarks);  
  }
  $('main').html(html);  
}

function generateButtons() {
  //function generates "add button" and "filter"
  return `<section class="buttons">
    <button type="button" class="add-button">Add bookmark</button>
    <section class="rating-filter">Filter by:
        <select>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>   
        </select>
      </section>
  </section>`;
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
  $('main').on('click','.add-button', event => {
    console.log("button clicked");  
    toggleStoreAdding();
  });
}
function toggleStoreAdding() {
  //This function toggles the store.adding element in our store.  Used for when user interacts with buttons.
  store.adding = !store.adding; 
  render();
}
function handleCancelButton() {
  $('main').on('click','.cancel-button', event => {
    console.log('cancel button clicked');
    toggleStoreAdding();
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
                <li>${item.title}</li>
                <li>${item.rating}</li>
                <li>${item.url}</li>
                <li>${item.description}</li>
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
  return `<li>${item.title}:   ${item.rating}</li>`;
}

    

function bindEventListeners () {
  console.log('bindEventListeners called');
  handleNewItemSubmit();
  handleAddBookmarkButton();
  handleCancelButton();

}

export default {
  render,
  bindEventListeners,
};
