const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

//let users = [];
let users = {"user":"password"};

const isValid = (username)=>{ //returns boolean
  return !(username in users);
  /*
    for(let i=0;i<users.length;i++)
    {
      if(users[i].username === username)
      {
        return false;
      }
    }
    return true;
  */
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  /*for(let i=0;i<users.length;i++)
  {
    if(users[i].username === username && users[i].password === password)
    {
      return true;
    }
  }
  return false;*/
  if(username in users)
  {
    return users[username] === password;
  }
  else
  {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password)
    {
      return res.status(401).json({message: "Error logging in"});
    }

    if(authenticatedUser(username,password)){
      let accessToken = jwt.sign({
        data: username
      },'access',{expiresIn: 60*60});

      req.session.authorization = {
        accessToken,username
      };

      return res.status(200).send("User successfully logged in");
    }else{
      return res.status(208).json({message: "Invalid login. check username and password"});
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.user.data;
  let review = req.body.review;
  let isbn = req.params.isbn;

  if(isbn in books)
  {
    books[isbn]["reviews"][username] = review;
    return res.json({"message":"review posted"});
  }
  else{
    return res.status(404).json({"message": "Invalid isbn"});
  }
});

regd_users.delete("/auth/review/:isbn", (req,res) =>{
  let username = req.user.data;
  let isbn = req.params.isbn;

  if(isbn in books)
  {
    if(username in books[isbn]["reviews"])
    {
      delete books[isbn]["reviews"][username];
      return res.json({"message":"review deleted"});
    }
    else
    {
      return res.status(404).json({"message": "No review for that username"});
    }
  }
  else{
    return res.status(404).json({"message": "Invalid isbn"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
