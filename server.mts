import express, { response } from "express";
import pgp from "pg-promise"
import dotenv from "dotenv"

dotenv.config()

const app = express();
const port = 3000;
//const bcrypt = require('bcrypt');

const connection = {
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: process.env.DATABASE_PASSWORD
}

const db = pgp({})(connection)


//login API
app.get('/login', (request, response) => {

  const username = request.query['username']
  const password = request.query['password']

  console.log({username, password})

  // Check if user exists

  response.send('Welcome to my server!');
});
//Get list of users API
app.get('/listUsers', async (request, response) => {
  const data = await db.any("SELECT * FROM trello.test");
  response.send(data)
})

// Create account API
app.post('/createAccount', async (request, response) => {
  try {
    const username = request.query['username'];
    const password = request.query['password'];

    if (!username || !password) {
      response.sendStatus(400);
      return;
    }

    const [{ count }] = await db.any("SELECT COUNT(*) FROM trello.user WHERE username = $1", [username]);
    if (count != 0) {
      response.status(400).send('User already exists');
      return;
    }

    // Sätt in användaren
    await db.any("INSERT INTO trello.user (username, password) VALUES ($1, $2)", [username, password]);
    
    response.status(200).send("Account created");
  } catch (error) {
    console.error(error);
    response.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/add-card', async (req, res) => {
  const message = req.query['message'];

  if (!message) {
    res.sendStatus(400);
    return;
  }
  
  db.any('Insert into ')

})