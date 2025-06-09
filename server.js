import express from 'express';
import expressLayout from 'express-ejs-layouts';
import staffsRouter from './routes/staffs.js'; //import the router module in /routes/staffs.js
// import methodOverride from 'method-override';

const app=express();

app.set('view engine', 'ejs');
app.set('layout', 'partials/base');

app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/staffs', staffsRouter)  // Mount it on the /staffs path

app.get('/', (req, res) => {
  res.render('index', {layout:'partials/indexbase'});
});

app.listen(3003)