const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
dbConnect();
app.use(cors());
app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Router setup
const authRouter = require('./routes/userRoute');
const rdvRouter = require('./routes/rdvRoute');
const contactRouter = require('./routes/contactRoute');
const documentRouter = require('./routes/documentsRoute');
const notificationRouter = require('./routes/notificationRoute');
const messageRoute = require('./routes/messageRoute')
const adminAvaibilityRoute = require('./routes/adminAvaibilityRoute')
const folderRoute = require('./routes/folderRoute')
const inventaireRoute = require('./routes/inventaireRoute')
const audianceRoute = require('./routes/audianceRoute')
const affaireRoute = require('./routes/affaireRoute')
const creditRoute  = require('./routes/creditRoute')
const addressRoute  = require('./routes/addressRoute')
const delegationRoute  = require('./routes/delegationRoute')
const citiesRoute  = require('./routes/citiesRoute')
const cercleRoute  = require('./routes/cerclesRoute')
const justificationRoute  = require('./routes/justificationRoute')
const depenseRoute  = require('./routes/depenseRoute')
const parEmailRoute  = require('./routes/parEmailRoute')
const guestRoute  = require('./routes/guestRoute')

const { sendSms } = require('./services/sendSms');   
app.use('/api/user', authRouter);
app.use('/api/rdvs', rdvRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/message',messageRoute );
app.use('/api/documents', documentRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin-availabilities', adminAvaibilityRoute);
app.use('/api/folder', folderRoute);
app.use('/api/inventaire', inventaireRoute);
app.use('/api/audiences', audianceRoute);
app.use('/api/affaires', affaireRoute);
app.use('/api/credit', creditRoute);
app.use('/api/address', addressRoute);
app.use('/api/delegation', delegationRoute);
app.use('/api/cities', citiesRoute);
app.use('/api/cercles', cercleRoute);
app.use('/api/justification', justificationRoute);
app.use('/api/depense', depenseRoute);
app.use('/api/emails', parEmailRoute);
app.use('/api/guest', guestRoute);

app.use(notFound);
app.use(errorHandler);
//  sendSms('HELLO FROM CGA ');
 const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

 io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('rdv-confirmed', ({ clientId, notification_created }) => {
   });

  socket.on('rdv-created', (data) => {
    console.log('New appointment created:', data.notification);
    io.emit('rdv-created', data);  
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

 server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});