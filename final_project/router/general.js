const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password)
  {
    return res.json({"message": "invalid username or password"});
  }

  if(isValid(username))
  {
    users[username] = password;
    res.json({"message": "user successfully created"});
    //users.push({"username":username,"password":password});
  }else{
    res.json({"message":"invalid username. Try again!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const get_books = new Promise((resolve, reject) =>{
    resolve(res.send(JSON.stringify(books,null,4)));
    reject(res.json({"message": "error"}));
  })
  
  get_books
  .then(()=>{console.log("promise resolved");})
  .catch(error=>{console.log("Error: " + error);});
  //res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const get_book_details = new Promise((resolve, reject)=>{
    let isbn = req.params.isbn;
    if(isbn in books){
      resolve(res.send(JSON.stringify(books[isbn],null,4)));
    }else{
      resolve(res.status(404).json({message: "Invalid isbn"}));
    }
    reject(res.json({"message": "error"}));
  });

  get_book_details
  .then(()=>{console.log("promise resolved");})
  .catch(error=>{console.log("Error: " + error);});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let get_book_details = new Promise((resolve,reject)=>{
    let author = req.params.author;
    let author_books = [];
    //Write your code here
    for(let key in books){
      if(books[key].author === author){
        author_books.push(
          {
            "title": books[key].title,
            "reviews": books[key].reviews
          }
        )
      }
    }
    if(author_books.length === 0)
    {
      resolve(res.status(404).json({"message": "Invalid author"}));
    }
    else
    {
      resolve(res.send(JSON.stringify(author_books,null,4)));
    }
    reject(res.json({"message": "error"}));
  });

  get_book_details
  .then(()=>{console.log("promise resolved");})
  .catch(error=>{console.log("Error: " + error);});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const get_books = new Promise((resolve,reject)=>{
    //Write your code here
    let title = req.params.title;
    let book_title = [];
    for(let key in books)
    {
      if(books[key].title === title)
      {
        book_title.push(
          {
            "author": books[key].author,
            "isbn": key,
            "reviews": books[key].reviews
          }
        )
      }
    }
    if(book_title.length === 0)
    {
      resolve(res.status(404).json({"message": "Invalid title"}));
    }
    else
    {
      resolve(res.send(JSON.stringify(book_title,null,4)));
    }
    reject(res.json({"message": "error"}));
  });
  get_books
  .then(()=>{console.log("promise resolved");})
  .catch(error=>{console.log("Error: " + error);});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(isbn in books)
  {
    res.send(JSON.stringify(books[isbn].reviews,null,4));
  }
  else
  {
    res.status(404).json({"message": "Invalid ISBN"});
  }
});

module.exports.general = public_users;
