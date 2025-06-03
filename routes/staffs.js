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

// initial routes to render the respective forms for user inputs
staffsRouter.get('/create1', (req, res) => {
  res.render('staffs/forms/create', {
    emailInput: '',
    departmentInput: '',
    titleInput: '',
    dateJoinedInput: '',
    message:'',
    staff:null
  });
});

// POST: Add a staff
staffsRouter.post('/create2', (req, res) => {
  try {
    const staffs = readStaffs();
    const newStaff = {
      email: req.body.email,
      department: req.body.department,
      title: req.body.title,
      date_joined: req.body.date_joined
    };
    staffs.push(newStaff);
    writeStaffs(staffs);
    res.render('staffs/forms/create', {
      emailInput: '',
      departmentInput: '',
      titleInput: '',
      dateJoinedInput: '',
      message: 'Success!!!',
      staff: newStaff
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error adding staff:', error);
    res.render('staffs/forms/create', {
      emailInput: req.body.email,
      departmentInput: req.body.department,
      titleInput: req.body.title,
      dateJoinedInput: req.body.date_joined,
      message: `Error, something went wrong. Unable to add staff with email ${req.body.email} to database.`,
      staff: null
    });
  }
});


// GET: list all staffs
staffsRouter.get('/allstaffs', (req, res) => {
  const staffs = readStaffs();
  const message = req.query.message || ''; // Extract message from query params
  res.render('staffs/forms/read', {
    message,
    viewstaffheader:'All Staffs',
    staffs:staffs,
    emailInput: null,
    hideForm: true
  });
});

staffsRouter.get('/read1', (req, res) => {
  // Render the form empty or with default emailInput, no results yet
  res.render('staffs/forms/read', { 
    emailInput: '',
    message: '',
    viewstaffheader:'View a Staff',
    staffs: null,
    hideForm: false
  });
});

staffsRouter.get('/read2', (req, res) => {
  const staffs = readStaffs();
  const givenEmail = req.query.email || '';
  const staff = staffs.find(u => u.email === givenEmail);
  const message = staff ? '' : 'Staff not found';
  
  // Render the same page with results included
  res.render('staffs/forms/read', {
    message:message,
    viewstaffheader:'View a Staff',
    staffs:staff,
    emailInput: givenEmail,
    hideForm: false
  });
});

staffsRouter.get('/update1', (req, res) => {
  res.render('staffs/forms/updateread', {
    emailInput: '',
    message: '',
    staff: null,
  });
});

// GET: check if particular user exists. and if so, output render the info inside the form for user to edit...and on submit after edit, it does an 'update' by deleting off the old record and creating and adding the new user based on user input
staffsRouter.get('/update2', (req, res) => {
  const staffs = readStaffs();
  const givenEmail = req.query.email;
  const staff = staffs.find(u => u.email === givenEmail);
  const message = staff ? '' : 'Staff not found';
  if (staff) {
    res.render('staffs/forms/updateread', {
    message: ``,
    emailInput:staff.email,
    departmentInput:staff.department,
    titleInput:staff.title,
    dateJoinedInput:staff.date_joined,
    staff: staff
  });
  }
  else{
    res.render('staffs/forms/updateread', {
      emailInput:givenEmail,
      message: message,
      staff: null
  });
  }
});

staffsRouter.post('/update2', (req, res) => {
  let staffs = readStaffs();
  const oldStaff={
    email: req.body.original_email,
    department: req.body.original_department,
    title: req.body.original_title,
    date_joined: req.body.original_date_joined
  };

  staffs = staffs.filter(u => u.email !== req.body.original_email);

  const newStaff = {
    email: req.body.email,
    department: req.body.department,
    title: req.body.title,
    date_joined: req.body.date_joined
  };
  staffs.push(newStaff);
  writeStaffs(staffs);
  res.status(201).render('staffs/outputs/updatedstaff', {message: ``, oldStaff:oldStaff, newStaff:newStaff});
});

staffsRouter.get('/delete1', (req, res) => {
  res.render('staffs/forms/delete', {
    emailInput: '',
    message: '',
    staff: null,
  });
});

// DELETE: Delete a staff
staffsRouter.post('/delete2', (req, res) => {
  let staffs = readStaffs();
  const givenEmail = req.body.email || '';
  const staff = staffs.find(u => u.email === givenEmail);
  const message = staff ? '' : 'Staff not found';
  if (staff) {
    staffs = staffs.filter(u => u.email !== staff.email);
    writeStaffs(staffs);
  }
  res.render('staffs/forms/delete', {
    emailInput: givenEmail,
    message: message,
    staff: staff
  });
});

export default staffsRouter;
