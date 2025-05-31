import express from 'express';
import fs from 'fs';
import path from 'path';

const staffsRouter = express.Router();
const dataFilePath = path.join('./', 'tables/staffs.json');

// Helper functions
function readStaffs() {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

function writeStaffs(staffs) {
  fs.writeFileSync(dataFilePath, JSON.stringify(staffs, null, 2));
}

// GET: staffs landing page
staffsRouter.get('/', (req, res) => {
  res.render('staffs');
});

// POST: Add a staff
staffsRouter.post('/', (req, res) => {
  const staffs = readStaffs();
  const newStaff = {
    email: req.body.email,
    department: req.body.department,
    title: req.body.title,
    date_joined: req.body.date_joined
  };
  staffs.push(newStaff);
  writeStaffs(staffs);
  res.status(201).redirect(`/staffs/allstaffs?message=staff ${newStaff.email} added to database.`);
});


// GET: list all staffs
staffsRouter.get('/allstaffs', (req, res) => {
  const staffs = readStaffs();
  const message = req.query.message || ''; // Extract message from query params
  res.render('staffs/outputs/allstaffs', {message, allStaffs:staffs, });

});

// GET: List a particular staff by email
staffsRouter.get('/read2', (req, res) => {
  const staffs = readStaffs();
  const givenEmail = req.query.email;
  const staff = staffs.find(u => u.email === givenEmail);
  if (!staff) {
    return res.status(404).render('staffs/outputs/singlestaff', {
      message: 'Staff not found',
      staff: null
    });
  }
  res.render('staffs/outputs/singlestaff', {
    message: ``,
    staff: staff
  });
});

// PUT: Update a staff
staffsRouter.put('/update2', (req, res) => {
  const staffs = readStaffs();
  const staff = staffs.find(u => u.name === req.body.currentEmail);
  if (!staff) {
    return res.status(404).render('staffs/outputs/singlestaff', {
      message: 'Staff not found',
      staff: null
    });
  }
  writeStaffs(staffs);
  res.redirect('/staffs/allstaffs');
});

// DELETE: Delete a staff
staffsRouter.delete('/delete2', (req, res) => {
  let staffs = readStaffs();
  const staff = staffs.find(u => u.email === req.body.email);
  if (!staff) {
    return res.status(404).render('staffs/outputs/singlestaff', {
      message: 'Staff not found',
      staff: null
    });
  }
  staffs = staffs.filter(u => u.email !== staff.email);
  writeStaffs(staffs);
  res.status(201).redirect(`/staffs/allstaffs?message=staff ${staff.email} deleted from database.`);
});

// initial routes to render the respective forms for user inputs
staffsRouter.get('/new', (req, res) => {
  res.render('staffs/forms/new', { emailInput: '', departmentInput: '', titleInput: '', dateJoinedInput: '', message:''});
});

staffsRouter.get('/read1', (req, res) => {
  res.render('staffs/forms/read', { emailInput: 'findStaff', message:``});
});

staffsRouter.get('/update1', (req, res) => {
  res.render('staffs/forms/update', { currentEmailInput: 'currentEmail'});
});

staffsRouter.get('/delete1', (req, res) => {
  res.render('staffs/forms/delete', { emailInput: 'targetStaff', message:``});
});

export default staffsRouter;