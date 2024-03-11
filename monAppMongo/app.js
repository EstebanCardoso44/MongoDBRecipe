const express = require('express');
const cors = require('cors');  // Importez le module cors
const app = express();
app.use(express.json());
app.use(cors());  // Utilisez le middleware cors
const port = 3000;

app.use(express.static(__dirname));


app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
const { MongoClient } = require('mongodb');
const uri = "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('Erreur de connexion à MongoDB', err);
    process.exit(1);
  }
  console.log('Connecté à la base de données MongoDB');
  // Vous pouvez commencer à utiliser MongoDB ici
});

app.get('/lire', async (req, res) => {
  try {
    const collection = client.db("admin").collection("Recipes");
    const result = await collection.find({}).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).send(error.message);
  }
});

app.post('/addRecipe', async (req, res) => {
  const recipe = req.body;

  try {
    const db = client.db('admin');
    const recipesCollection = db.collection('Recipes');

    const result = await recipesCollection.insertOne(recipe);

    if (result.insertedCount > 0) {
      console.log('Recette ajoutée à la base de données:', result.ops[0]);
      res.json({ success: true, recipe: result.ops[0] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


