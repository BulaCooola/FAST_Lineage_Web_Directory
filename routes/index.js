// 
import lineRoutes from "lines.js";

const constructorMethod = (app) => {
    // app.use('/events', eventsRoutes);
    // app.use('/attendees', attendeesRoutes);
    app.use('/', lineRoutes);
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Not found'});
    });
  };
export default constructorMethod;// 