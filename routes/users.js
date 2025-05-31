import express from 'express';
import fs from 'fs';
import path from 'path';

const usersRouter = express.Router();
const dataFilePath = path.join('./', 'tables/users.json');

// Helper functions
function readUsers() {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
}

// POST: Add a user
usersRouter.post('/', (req, res) => {
  const users = readUsers();
  const newUser = {
    email: req.body.email,
    department: req.body.department,
    title: req.body.title,
    date_joined: req.body.date_joined
  };
  users.push(newUser);
  writeUsers(users);
  res.status(201).redirect(`/users/allusers?message=user ${newUser.email} added to database.`);

});


// GET: list all users
usersRouter.get('/allusers', (req, res) => {
  const users = readUsers();
  const message = req.query.message || ''; // Extract message from query params
  res.render('users/outputs/allusers', {message, allUsers:users, });

});

// GET: List a particular user by email
usersRouter.get('/read2', (req, res) => {
  const users = readUsers();
  const givenEmail = req.query.email;
  const user = users.find(u => u.email === givenEmail);
  if (!user) {
    return res.status(404).render('users/outputs/singleuser', {
      message: 'User not found',
      user: null
    });
  }
  res.render('users/outputs/singleuser', {
    message: ``,
    user: user
  });
});

// PUT: Update a user
usersRouter.put('/update2', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.name === req.body.currentEmail);
  if (!user) {
    return res.status(404).render('users/outputs/singleuser', {
      message: 'User not found',
      user: null
    });
  }
  writeUsers(users);
  res.redirect('/users/allusers');
});

// DELETE: Delete a user
usersRouter.delete('/delete2', (req, res) => {
  let users = readUsers();
  const user = users.find(u => u.email === req.body.email);
  if (!user) {
    return res.status(404).render('users/outputs/singleuser', {
      message: 'User not found',
      user: null
    });
  }
  users = users.filter(u => u.email !== user.email);
  writeUsers(users);
  res.status(201).redirect(`/users/allusers?message=user ${user.email} deleted from database.`);
});

// Other routes remain unchanged
usersRouter.get('/new', (req, res) => {
  res.render('users/forms/new', { emailInput: '', departmentInput: '', titleInput: '', dateJoinedInput: '', message:'Create New User'});
});

usersRouter.get('/read1', (req, res) => {
  res.render('users/forms/read', { emailInput: 'findUser'});
});

usersRouter.get('/update1', (req, res) => {
  res.render('users/forms/update', { currentEmailInput: 'currentEmail'});
});

usersRouter.get('/delete1', (req, res) => {
  res.render('users/forms/delete', { emailInput: 'targetUser' });
});

export default usersRouter;