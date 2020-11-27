const express = require('express')
const server = express()

const path = require('path')

//middleware
server.use(express.static(path.join(__dirname, '..', './public')))
server.use(express.json())

//knex db
const knex = require('knex')
const config = require('../knexfile').development
const db = knex(config)

// get all users
server.get('/users', (req, res) => {
   db('users')
      .select()
      .then(data => {
         res.json(data)
      })
      .catch(err => res.status(500).send({
         message: "server error 2"
      }))
})


// get users by id
server.get('/users/:id', (req, res) => {
   db.select()
      .from('users')
      .where('id', req.param.id)
      .then((users) => {
         res.send(users)
      })
})


// get all todos
server.get('/todos', (req, res) => {
   db('todos')
      .select()
      .then(data => {
         res.json(data)
      })
      .catch(err => res.status(500).send({
         message: "server error 2"
      }))
})

// create post in users
server.post('/users', (req, res) => {
   db('users').insert({
      name: req.body.name,
      email: req.body.email
   })
      .then(() => {
         db.select()
            .from('users')
            .then((users) => {
               res.send(users)
            })
      })
})

// update post in users
server.put('/users/:id', (req, res) => {
   db('users').where('id', req.params.id)
      .update({
         name: req.body.name,
         email: req.body.email
      })
      .then(() => {
         db.select()
            .from('users')
            .then((users) => {
               res.send(users)
            })
      })
})

// update post in todos
server.put('/todos/:id', (req, res) => {
   db('todos').where('id', req.params.id)
      .update({
         title: req.body.title,
         user_id: req.body.user_id
      })
      .then(() => {
         db.select()
            .from('todos')
            .then((todos) => {
               res.send(todos)
            })
      })
})

// delete posts by id
server.delete('/users/:id', (req, res) => {
   db('users').where('id', req.params.id)
      .del()
      .then(() => {
         db.select()
            .from('users')
            .then((users) => {
               res.send(users)
            })
      })
})

// join user details in todos
server.get('/todos-of-user/:id', (req, res) => {
   db.from('todos')
      .innerJoin('users', 'todos.user_id', 'users.id')
      .where('todos.user_id', req.params.id)
      .then((data) => {
         res.send(data)
      })
})

module.exports = server

// server.post('/users', (req, res) => {
//     db.raw('insert into users(id, name, email) values(?, ?)', ['go play some sports'])
//         .then(()=> {
//             db.select().from('users')
//                 .then((users)=> {
//                     res.send(users)
//                 })
//         })
// })

//data routes
// server.use('/api/data', dataRoute)
