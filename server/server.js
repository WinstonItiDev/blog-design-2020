const express = require('express')
const cors = require('cors');
const path = require('path')
const bcrypt = require('bcryptjs');
const knex = require('knex')
const dotenv = require('dotenv').config();
const config = require('../knexfile').development
const db = knex(config)
const session = require('express-session'); // brints in session library
const knexSessionStore = require('connect-session-knex')(session);

const sessionConfig = {
	secret: `${process.env.SESSION_SECRET}`,
	name: `${process.env.SESSION_NAME}`, // defaults to connect.sid
	cookie: {
		secure: false, // over http(S) in production change to true
		maxAge: 1000 * 60 * 5
	},
	httpOnly: true, // JS can't access, only https
	resave: false,
	saveUninitialized: false, // has something to do with foreign laws
	store: new knexSessionStore({
		// creates memcache
		tablename: 'sessions', // session table name
		sidfiledname: 'sid', //session field name
		knex: db, // what database you want to knex to use
		createtable: true, // have the library create the table if there isn't one
		clearInterval: 1000 * 60 * 60 // clear every hour
	})
};


// middleware
const server = express()
server.use(session(sessionConfig)); // wires up session management
server.use(express.static(path.join(__dirname, '..', './public')))
server.use(express.json())
server.use(cors())

server.get('/api/v1', (req, res) => {
	res.send('Server is running');
});

function restricted(req, res, next) {
	// if logged in
	if (req.session && req.session.userId) {
		// they're logged in, go ahead and provide access
		next();
	} else {
		// bounce them
		res.status(401).json({ message: 'Invalid credentials' });
	}
}

// get all user id and usernames
server.get('/api/v1/users', restricted, (req, res) => {
	db('users')
		.select('id', 'name')
		.then((user) => res.status(400).json(user))
		.catch((err) => res.status({ message: 'error getting that data', err }));
});

// register a user by username and password
server.post('/api/v1/register', (req, res) => {
	const creds = req.body;
	const hash = bcrypt.hashSync(creds.password, 14);
	creds.password = hash;
	db('users')
		.insert(creds)
		.then((ids) => {
			res.status(201).json({ message: 'Succesfully registered user!', ids});
		})
		.catch((err) => res.status(400).json(err));
});

server.post('/api/v1/login', (req, res) => {
	const creds = req.body;
	db('users')
		.where({ name: creds.name })
		.first()
		.then((user) => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				// passwords match and user exists by that username
				req.session.userId = user.id;
				res.status(200).json({ message: 'welcome' });
			} else {
				// either username is invalid or password is wrong
				res.status(401).json({ message: 'you shall not pass' });
			}
		})
		.catch((err) => res.status(500).json({ err }));
});

// logout
server.get('/api/v1/logout', (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.send('you can never logout');
			} else {
				res.send('you have logged out');
			}
		});
	}
});

// // @hapi/joi
// // knex db
// // encryption
// const bcrypt = require('bcryptjs');

// const schema = Joi.object({
//    name: Joi.string().min(6).max(50).required(),
//    email: Joi.string().min(6).required().email(),
//    password: Joi.string().min(6).required()
// });

// // REGISTER
// server.post('/api/v1/register', (req, res) => {

//    // store body information (credentials, inputted information)
//    const creds = req.body;

//    // will validate the data before making a user
//    const { error } = schema.validate(creds)

//    if (error)
//       return res.status(400).send(error.details[0].message)

//    const hash = bcrypt.hashSync(creds.password, 14);
//    creds.password = hash;

//    db('users') 
//       .insert(creds)
//       .then((ids) => {
//          res.status(201).json(ids);
//       })
//       .catch((err) => res.status(400).json(err));

// })

// server.post('/api/v1/login', (req, res) => {

//    // store body information (credentials, inputted information)
//    const creds = req.body;

//    // will validate the data before making a user
//    const { error } = schema.validate(creds)

//    if (error)
//       return res.status(400).send(error.details[0].message)

// 	db('users')
// 		.where({ name: creds.name })
// 		.first()
// 		.then((user) => {
// 			if (user && bcrypt.compareSync(creds.password, user.password)) {
// 				// passwords match and user exists by that username
// 				// req.session.userId = user.id;
// 				res.status(200).json({ message: 'welcome' });
// 			} else {
// 				// either username is invalid or password is wrong
// 				res.status(401).json({ message: 'you shall not pass' });
// 			}
// 		})
// 		.catch((err) => res.status(500).send(err))
// });


   // db.select('name')
   //    .from('users')
   //    .where('name', req.body.name)
   //    .then(nameList => {
   //       console.log(nameList);
   //       if (nameList.length === 0) {
   //          return db('users')
   //             .insert([{
   //                name: req.body.name,
   //                email: req.body.email,
   //                password: req.body.password
   //             }]).then(() => {
   //                db.select()
   //                   .from('users')
   //                   .then((users) => {
   //                      res.send(users)
   //                   })
   //             })
   //       }
   //       res.status(400).send("User already taken")
   //       return
   //    })

   // db.select('email')
   //    .from('users')
   //    .where('email', req.body.email)
   //    .then(nameList => {
   //       if (nameList.length === 0) {
   //          return db('users')
   //             .insert([{
   //                name: req.body.name,
   //                email: req.body.email,
   //                password: req.body.password
   //             }]).then(() => {
   //                db.select()
   //                   .from('users')
   //                   .then((users) => {
   //                      res.send(users)
   //                   })
   //             })
   //       }
   //       res.status(400).send("Email already taken")
   //       return
   //    })


   // db('users').insert({
   //    name: req.body.name,
   //    email: req.body.email,
   //    password: req.body.password
   // }).then(() => {
   //    db.select()
   //       .from('users')
   //       .then((users) => {
   //          res.send(users)
   //       })
   // })



// server.post('/api/v1/login', (req, res) => {
//    // will validate the data before making a user
//    const { error } = schema.validate(req.body)

//    if (error)
//       return res.status(400).send(error.details[0].message)

//       db.select('name')
//       .from('users')
//       .where('name', req.body.name)
//       .then(nameList => {
//          console.log(nameList);
//          res.send(nameList)
//          if (nameList === req.body.name) {
//             return db('users')

//          }
//          res.status(400).send("User already taken")
//          return
//       })
// })

// get all users


module.exports = server

// instead of joi, you can use express validator
// EX:
//
// express-validator
// const { body, validationResult } = require('express-validator')

// server.post('/api/v1/register', [
//    body('name').isLength({ min: 6, max: 18}),
//    body('email').isLength({ min: 6, max: 18}).isEmail(),
//    body('password').isLength({ min: 5})
// ], (req, res) => {
//    const errors = validationResult(req)
//    if(!errors.isEmpty()) {
//       return res.status(400).json({ error: errors.array() })
//    }
//    db('users').insert({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password
//    }).then(() => {
//       db.select()
//          .from('users')
//          .then((users) => {
//             res.send(users)
//          })
//    })
// })
