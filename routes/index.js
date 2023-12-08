import userRoutes from "./users.js"
import lineRoutes from "./lines.js";
import imageRoutes from "./images.js"
import path from 'path';


// NOTE: (Branden Bulatao)
// I am not 100 percent sure if we are going to need
// multiple routes because it would cause confusion 
// with where the tabs go.
// ! '/' should be the homepage, no doubt about it
// the answer might reveal itself when we try
// to implement the navigation bar on the homepage

const constructorMethod = (app) => {
    app.get('/', function(req, res) {
        res.render('home');
    });
    app.use('/users', userRoutes);
    app.use('/lines', lineRoutes);
    app.use('/images', imageRoutes)
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Not found'});
    });
  };
export default constructorMethod;