const store = {
  bookmarks: [
    {
      id: 'x56w',
      title: 'Title 1',
      rating: 3,
      url: 'http://www.title1.com',
      description: 'lorem ipsum dolor sit',
      expanded: false
    },
    {
      id: '6ffw',
      title: 'Title 2',
      rating: 5,
      url: 'http://www.title2.com',
      description: 'dolorum tempore deserunt',
      expanded: false
    },
    {
      id: '7ddr',
      title: 'Title 11',
      rating: 5,
      url: 'http://www.title11.com',
      description: 'lorem ipsum dolor',
      expanded: true
    }
  ],
  adding: false,
  error: null,
  filter: 0
};
  
  
  
function render() {
  let bookmarks = [...store.bookmarks]
  let html = generateBookmarkItemString(bookmarks);
  $('.bookmark-list').html(html);
  
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

function generateExpandedItem(item) {
    return `<section class='expanded-item'>
        <li>${item.title}</li>
        <li>${item.rating}</li>
        <li>${item.url}</li>
        <li>${item.description}</li>
      </section>`;
}
  
function generateBookmarkElement(item) {
  return `<li>${item.title}:   ${item.rating}</li>`;
}
const handleBookmarkApp = function() {
  render();
};
  
$(handleBookmarkApp);
/**
   * 
   * Technical requirements:
   * 
   * Your app should include a render() function, that regenerates the view each time the store is updated. 
   * See your course material, consult your instructor, and reference the slides for more details.
   *
   * NO additional HTML elements should be added to the index.html file.
   *
   * You may add attributes (classes, ids, etc) to the existing HTML elements, or link stylesheets or additional scripts if necessary
   *
   * SEE BELOW FOR THE CATEGORIES OF THE TYPES OF FUNCTIONS YOU WILL BE CREATING 👇
   * 
   */
  
/********** TEMPLATE GENERATION FUNCTIONS **********/
  
// These functions return HTML templates
  
/********** RENDER FUNCTION(S) **********/
  
// This function conditionally replaces the contents of the <main> tag based on the state of the store
  
/********** EVENT HANDLER FUNCTIONS **********/
  
// These functions handle events (submit, click, etc)