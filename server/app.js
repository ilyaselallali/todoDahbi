const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');


const app = express();
app.use(cors());

const url = 'mongodb://localhost:27017';
const dbName = 'todos';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log('Error connecting to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB server');

  const db = client.db(dbName);
  const todosCollection = db.collection('todos');

  // Ajouter une tâche à faire
  app.post('/todos', (req, res) => {
    const newTodo = req.body;

    todosCollection.insertOne(newTodo, (err, result) => {
      if (err) {
        console.log('Error adding todo:', err);
        res.status(500).send('Error adding todo');
        return;
      }

      res.send(result.ops[0]);
    });
  });

  // Récupérer toutes les tâches à faire
  app.get('/todos', (req, res) => {
    todosCollection.find().toArray((err, docs) => {
      if (err) {
        console.log('Error getting todos:', err);
        res.status(500).send('Error getting todos');
        return;
      }

      res.send(docs);
    });
  });
  app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    todosCollection.deleteOne({ _id: ObjectId(id) }, (err, result) => {
      if (err) {
        console.log('Error deleting todo:', err);
        res.status(500).send('Error deleting todo');
        return;
      }

      res.send(result);
    });
  });

  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
});
