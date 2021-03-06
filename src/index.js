const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(400).json({ error: "User not found!"})
  }

  request.user = user;

  return next();
}



app.post('/users',  (request, response) => {

  const { name, username} = request.body;


  const checkUser = users.some(user => user.username === username);

  if(checkUser) {
    return response.status(400).json({ error: "User already exists!"})
  }

  const user = { id: uuidv4(), name, username, todos: [] };
  
  
  users.push(user);

  return response.status(201).json(user);

});

app.use(checksExistsUserAccount);

app.get('/todos', (request, response) => {
  const { user } = request;  

  return response.status(200).json(user.todos);

});

app.post('/todos', (request, response) => {
const { title, deadline } = request.body;

const { user } = request;

const newTodos = {
  id: uuidv4(),
  title,
  done: false,
  deadline:  new Date(deadline),
  created_at: new Date,
}
 user.todos.push(newTodos);

 return response.status(201).send(newTodos);

});

app.put('/todos/:id', (request, response) => {
  const  { user }  = request;
  const { id } = request.params;
  const { title, deadline} = request.body;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);
  console.log(user)

  if( todoIndex < 0) {
    
    return response.status(404).json({ error: 'Todo not found'})

  }

  const todo = user.todos[todoIndex];

  todo.title = title;
  todo.deadline = deadline;

  

 return response.status(200).send(todo);

  
});

app.patch('/todos/:id/done', (request, response) => {
const { user } = request;
const { id } = request.params;

const todoIndex = user.todos.findIndex(todo => todo.id === id);

if( todoIndex < 0) {
  return response.status(404).json({ error: 'Todo not found'})

}

const todo = user.todos[todoIndex];

todo.done = true;
return response.status(200).send(todo);

});

app.delete('/todos/:id', (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if( todoIndex < 0) {
  return response.status(404).json({ error: 'Todo not found'})

}


  user.todos.splice(todoIndex, 1);

  return response.status(204).json(user.todos);

});

module.exports = app;