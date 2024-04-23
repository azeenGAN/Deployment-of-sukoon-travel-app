const express = require('express')
const path = require('path');
const { connectToMongoDB, closeConnection, getDatabase } = require('./db');

//  const cors = require('cors');


const app = express()
const port = process.env.PORT || 8080

let db
basename='sukoon01'
async function dbConnection() {
  try {
    await connectToMongoDB(basename);
    db = await getDatabase();
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error establishing MongoDB connection:", error);
  }
}
dbConnection();


let q;
let t={
  Ryan_gosling:{
    name:"Ryan Gosling",
    position:"Cheif Talent Officer",
    depart:"Talent Aquisition",
    join_date:"March  2021",
    status:"currently working",
    education:"master's in health and safety management",
    description:"He was previously Global Chief Talent Officer at PepsiCo in addition to serving as Chief Human Resources Officer for global functions and groups. "
  },
  Maria_Fernandez:{
    name:"Maria Fernandez",
    position:"Chief Product Officer",
    depart:"Product Development",
    join_date:"early 2021",
    status:"currently working",
    education:"M.B.A. from the University of Chicago Booth School of Business",
    description:"She serves on the Board of Directors for Cure CMD."
  },
  Ava_Oliver:{
    name:"Ava Oliver",
    position:"Chief Technology Officer",
    depart:"Information Technology",
    join_date:"2020",
    status:"currently working",
    education:"Graduate of MIT and Stanford University",
    description:"Elizabeth previously worked in finance as a trader at Merrill Lynch and economist at Analysis Group before transitioning to the tech industry."
  },
  Meave_Murphy:{
    name:"Meave Murphy",
    position:"VP Finance and coorporate development",
    depart:"Accounts",
    join_date:"October 2020",
    status:"currently working",
    education:" Graduate of Bristol University",
    description:" Prior to Netflix, Spencer worked on Wall Street for 16 years, where he was an award-winning equity research analyst specializing in the Internet and Media sectors."
  }
}
// app.use(express.static('src'))


app.use(express.json());

// middleware
app.use('/api/form', (req, res, next) => {
  
  req.body.Request_time = new Date().toString();


  next(); // Move to the next middleware or route handler
});

// Your API endpoint
app.post('/api/form', (req, res) => {
  res.send(`Mr ${req.body.last_name}, your information has been received. Our staff member will reach out to you.`);
//sending customer data to database
db.collection('bookings').insertOne(req.body)
});

app.get('/leadership',(req, res)=>{
  res.send(t)
})

app.post('/verify', async (request, response) => {
  const { recaptchaValue } = request.body;
  
  try {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=6LcRJZspAAAAAKCunF2KyUxnVnak7R3NZymrbjyl&response=${recaptchaValue}`;
    const fetchResponse = await fetch(url, { method: 'POST' });
    const data = await fetchResponse.json();
    response.send(data);
  } catch (error) {
    console.error('Error occurred during reCAPTCHA verification:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Catch-all route for client-side routing

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

process.on('SIGINT', async () => {
  await closeConnection();
  process.exit();
});
