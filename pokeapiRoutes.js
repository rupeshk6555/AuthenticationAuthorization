// pokemonRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'pokemonDB';

// Connect to MongoDB
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const pokemonCollection = db.collection('pokemon');

    // Get a list of Pokemon
    router.get('/', authenticateToken, (req, res) => {
      pokemonCollection
        .find()
        .toArray()
        .then((pokemonList) => {
          res.json(pokemonList);
        })
        .catch((err) => {
          console.error('Failed to get Pokemon list:', err);
          res.status(500).json({ message: 'Internal server error' });
        });
    });

    // Create a Pokemon
    router.post('/', authenticateToken, (req, res) => {
      const { name } = req.body;
      const newPokemon = { name };

      pokemonCollection
        .insertOne(newPokemon)
        .then(() => {
          res.status(201).json(newPokemon);
        })
        .catch((err) => {
          console.error('Failed to create Pokemon:', err);
          res.status(500).json({ message: 'Internal server error' });
        });
    });

    // Get a single Pokemon by ID
    router.get('/:id', authenticateToken, (req, res) => {
      const id = parseInt(req.params.id);

      pokemonCollection
        .findOne({ id })
        .then((pokemon) => {
          if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
          }

          res.json(pokemon);
        })
        .catch((err) => {
          console.error('Failed to get Pokemon:', err);
          res.status(500).json({ message: 'Internal server error' });
        });
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

module.exports = router;
