const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const checkUser = users.find(user => user.username === username);

  if(checkUser) {
    return response.status(400).json({ error: "User already exists!"})
  }

  request.user = user;

  return next();
}

app.post('/users',  (request, response) => {
  const { name, username } = request.body;

  const checkUser = users.some(user => user.username === username);

  if(checkUser) {
    return response.status(400).json({ error: "User already exists!"})
  }


  users.push({
    id: uuidv4(),
    name,
    username, 
    todos: []
  })

  return response.status(201).send();

});


app.use(checksExistsUserAccount);

app.get('/todos',  (request, response) => {
  const { user }  = request;

  
  return response.status(200).json(user.todos);
  
});

app.post('/todos', (request, response) => {
  const { title, deadline } = request.body;

  const user = request;

  const todoCreate = {
    id: uuidv4(),
    title,
    done: false,
    deadline: Date(deadline),
    created_at: new Date()

  }

  user.todos.push(todoCreate);

  return response.status(201).send();
});

app.put('/todos/:id', (request, response) => {
  const { username } = request.headers;
  const { title, deadline} = request.body;


  const user = users.find(user => user.username === username);

  
  if(!user) {
    return response.status(400).json({ error: "User not found."})
  }

  user.title = title;
  user.deadline = deadline;

  return response.status(200).send();

});

app.patch('/todos/:id/done', (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', (request, response) => {
  const { user } = request;

  const userIndex = users.indexOf(user);

  users.splice(userIndex, 1);

  return response.status(200).json(users);

});

module.exports = app;