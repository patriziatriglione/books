import "../css/style.css";
const axios = require('axios');
const _ = require('lodash');
const Swal = require('sweetalert2');
const loading = document.getElementById("loading");
const genreButtons = document.querySelectorAll(".genre-button");
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById('search');
const submitButton = document.getElementById('submit');
const noResults = document.getElementById("noBooks");

// function create Element
function createElement (tagElement,classElement,textElement) {
  tagElement = document.createElement(tagElement);
  tagElement.classList.add(classElement);
  textElement = document.createTextNode(textElement);
  tagElement.appendChild(textElement);
  return tagElement;
}
// blockquote caorusel
let slideIndex = 0;
showSlides();
function showSlides() {
  let slides = document.getElementsByClassName("mySlides");
  for ( let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
   }
   slideIndex++;
   if (slideIndex > slides.length) {slideIndex = 1}    
   slides[slideIndex-1].style.display = "block";  
   setTimeout(showSlides, 5000); 
  };
// input search 
submitButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const query = searchInput.value;
  try { 
    bookList.innerHTML = '';
    loading.style.display ="flex";
    noResults.style.display ="none";
  const books = await searchBooks(query);
  renderBooks(books);
}catch(error){
  console.error(error);
  alert(`Ops, something goes wrong, try again: ${error.message}`);
}finally {
  loading.style.display ="none";
}
});
// genre button
genreButtons.forEach(button => {
  const query = button.dataset.genre;
  button.addEventListener("click",async() => {
    try {
    bookList.innerHTML = '';
    loading.style.display ="flex";
    noResults.style.display ="none";
  const books = await searchBooks(query);
  renderBooks(books);
}catch(error){
  console.error(error);
  alert(`Ops, something goes wrong, try again: ${error.message}`);
}finally {
  loading.style.display ="none";
}
});
  })
// function to call the api
async function searchBooks(query) {
  const url = `http://openlibrary.org/search.json?q=${query}&limit=25`;
  const response = await axios.get(url);
  const books = response.data.docs;
  return books;
};
// function that uses the key to look up the description and create the items
// show a message in case there are no books
async function renderBooks(books) { 
  if (books.length == 0) {
    noResults.style.display ="flex";
  }
  // creation of items
for (const book of books) {
    const bookUrl = `https://openlibrary.org${book.key}.json`;
    const bookResponse = await axios.get(bookUrl);
    const bookData = bookResponse.data;
    const listItem = createElement("li","list","");
    const bookTitle = createElement("h3","title","")
    const bookAuthor = createElement("p","author","");
    const bookCover = createElement("img","imgBook","");
    const buttonDescription = createElement("button","buttonDescription","Information");
    bookTitle.innerText = book.title;
    bookAuthor.innerText = `Author: ${book.author_name}` || `Unknown`;
    if (book.cover_i) {
      bookCover.src = `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    } else {
      bookCover.src = 'http://via.placeholder.com/128x192.png?text=No+Cover';
    }
    bookList.appendChild(listItem);
    listItem.appendChild(bookCover);
    listItem.appendChild(bookTitle);
    listItem.appendChild(bookAuthor);
    listItem.appendChild(buttonDescription);
    // event that pops up the description
    buttonDescription.addEventListener ("click", () => {
      Swal.fire ({
        title: book.title,
        text: typeof bookData.description === 'object' ? 'Sorry! The description is not available' : bookData.description,
        imageUrl: `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
        imageAlt: book.title,
        confirmButtonText: "Close",
        backdrop: `rgba(0,157,255,0.34)`,
        color: '#002F93'
      });
    });
}}
