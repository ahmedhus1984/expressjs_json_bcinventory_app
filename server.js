import express from 'express';
import expressLayout from 'express-ejs-layouts';
import staffsRouter from './routes/staffs.js'; //import the router module in /routes/staffs.js
import methodOverride from 'method-override';

const app=express();

app.set('view engine', 'ejs');
app.set('layout', 'partials/base');

app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;  // Remove _method from body after using it
    return method;
  }
}));

app.use('/staffs', staffsRouter)  // Mount it on the /staffs path

app.get('/', (req, res) => {
  res.render('index', {layout:'partials/indexbase'});
});

app.listen(3003)