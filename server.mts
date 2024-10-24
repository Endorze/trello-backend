import express from "express";
import pgp from "pg-promise"
import dotenv from "dotenv"

dotenv.config()

const app = express();
const port = 3000;

const connection = {
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: process.env.DATABASE_PASSWORD
}

const db = pgp({})(connection)

app.get('/login', (request, response) => {

  const username = request.query['username']
  const password = request.query['password']

  console.log({username, password})

  // Check if user exists

  response.send('Welcome to my server!');
});

app.get('/listUsers', async (request, response) => {
  const data = await db.any("SELECT * FROM trello.test");
  response.send(data)
})

app.post('/createAccount', async (request, response) => {
  const username = request.query['username']
  const password = request.query['password']

  if (!username) {
    response.sendStatus(400);
    return;
  }
  
  if (!password) {
    response.sendStatus(400);
    return;
  }

  const [{count}] = await db.any("Select count(*) from trello.user where username = $1", [username])
  if (count != 0) {
    response.status(400).send('User already exists')
    return;
  }

  response.sendStatus(200)
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});