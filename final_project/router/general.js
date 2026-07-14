const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
      if(isValid(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered! Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    } else {
      return res.status(404).json({message: "Unable to register user."})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(json.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  const isbns = Object.keys(books);

  const booksByAuthors = isbns.filter((isbn) => books[isbn].author === author);

  if (booksByAuthors.length > 0) {
    const result = {};
    booksByAuthors.forEach((isbn) => { result[isbn] = books[isbn]});
    res.send(result);
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const isbns = Object.keys(books);

  const booksByTitles = isbns.filter((isbn) => books[isbn].title === title);

  if(booksByTitles > 0) {
    const result = {};

    booksByTitles.forEach((isbn) => { result[isbn] = books[isbn]});

    res.send(result);
  } else {
    return res.status(404).json({message: "No books found for this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;

    if(books[isbn].reviews.length > 0) {
        res.send(books[isbn].reviews);
    } else {
      return res.status(404).json( {message: "No reviews found"});
    }
});

async function getBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("Books:", response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

async function getBooksByISBNAsync(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Books with ISBN ${isbn}:`, response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(`Books by ${author}:`, response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

async function getBooksByTitleAsync(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Books with title ${title}:`, response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

module.exports.general = public_users;
module.exports.getBooksAsync = getBooksAsync;
module.exports.getBooksByISBNAsync = getBooksByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
