// Setup empty JS object to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;

const server = app.listen(port, listening);

function listening(){
  console.log(`Server running on http://localhost:${port}/ ...`);
  console.log("Run CONTROL+C to quit");
};

// Launch the home page
app.get('/', (request, response) => response.render('index.html'));

// To view the existing data during development
app.get('/all', (request, response) => response.send(projectData));

// Add weather data of a city
app.post('/add', (request, response) => projectData.push(request.body));
