import userRoutes from "./users.js"
import lineRoutes from "./lines.js";
import imageRoutes from "./images.js"
import path from 'path';



const constructorMethod = (app) => {
  app.get('/', function (req, res) {
    res.render('home', { pageTitle: 'Home', isAuthenticated: res.locals.isAuthenticated });
  });
  app.use('/users', userRoutes);
  app.use('/lines', lineRoutes);
  app.use('/images', imageRoutes)

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};
export default constructorMethod;