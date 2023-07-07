const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { authenticateUser, generateToken } = require('./auth');
const pokemonRoutes = require('./pokeapiRoutes');



const app = express();
app.use(bodyParser.json());

 
const dbName = 'pokemonDB';
const mongoURI = `mongodb+srv://rupeshk983548:1234@cluster0.43rmet9.mongodb.net/${dbName}?retryWrites=true&w=majority`;

 
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

 
    app.use('/pokemon', pokemonRoutes);

 
    app.post('/login', (req, res) => {
      const { email, password } = req.body;
 
      const user = authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

 
      const token = generateToken(email);
 
      res.json({ token });
    });

 
    app.get('/', (req, res) => {
      const documentation = {
        endpoints: [
          {
            method: 'POST',
            path: '/login',
            description: 'Authenticate user and generate a JWT token',
            body: {
              email: 'string',
              password: 'string'
            },
            response: {
              token: 'string'
            }
          },
          {
            method: 'GET',
            path: '/pokemon',
            description: 'Get a list of Pokemon',
            authorization: 'Bearer token',
            response: [
              {
                id: 'number',
                name: 'string'
              }
            ]
          },
          {
            method: 'POST',
            path: '/pokemon',
            description: 'Create a new Pokemon',
            authorization: 'Bearer token',
            body: {
              name: 'string'
            },
            response: {
              id: 'number',
              name: 'string'
            }
          },
          {
            method: 'GET',
            path: '/pokemon/:id',
            description: 'Get a single Pokemon by ID',
            authorization: 'Bearer token',
            response: {
              id: 'number',
              name: 'string'
            }
          }
        ]
      };

      res.json(documentation);
    });

 
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

 