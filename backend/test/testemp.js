const request = require('supertest');
const app = require('../Server'); // Assurez-vous de pointer vers votre application Express
const assert = require('assert');
const mongoose = require('mongoose'); // Importez mongoose

const Emp = require("../Models/user");

// Avant les tests, connectez-vous à la base de données
before((done) => {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://localhost:27017/testDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        console.error('Erreur de connexion : ', err);
        done(err);
      } else {
        console.log('Connexion à MongoDB réussie');
        done();
      }
    });
  } else {
    done();
  }
});

// Après les tests, déconnectez-vous de la base de données
after((done) => {
  mongoose.disconnect(() => {
    console.log('Déconnexion de MongoDB réussie');
    done();
  });
});

describe('POST /ajouterEmp', () => {
  it('devrait ajouter un nouvel employé avec succès', async () => {
    // Données de test pour l'employé
    const empData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'Software Engineer'
    };

    // Simuler une requête POST vers la route /ajouterEmp avec les données de l'employé
    const response = await request(app)
      .post('/ajouterEmp')
      .send(empData)
      .expect(200); // Attendu : Code de statut HTTP 200

    // Vérifier la réponse de la requête
    assert(response.body._id); // Attendu : L'employé ajouté a un ID
    assert.strictEqual(response.body.name, empData.name); // Attendu : Le nom de l'employé est correct
    assert.strictEqual(response.body.email, empData.email); // Attendu : L'email de l'employé est correct
    assert.strictEqual(response.body.role, empData.role); // Attendu : Le rôle de l'employé est correct

    // Vérifier si l'employé a été enregistré dans la base de données
    const savedEmp = await Emp.findOne({ email: empData.email });
    assert(savedEmp); // Attendu : L'employé est trouvé dans la base de données
  });

  it('devrait renvoyer une erreur si les données sont incomplètes', async () => {
    // Données de test incomplètes pour l'employé
    const empData = {
      name: 'Jane Doe',
      // email et role manquants
    };

    // Simuler une requête POST vers la route /ajouterEmp avec des données incomplètes
    const response = await request(app)
      .post('/ajouterEmp')
      .send(empData)
      .expect(500); // Attendu : Code de statut HTTP 500

    // Vérifier si l'API renvoie un message d'erreur
    assert(response.body.error);
  });
});


describe('GET /api/emp/userListe', () => {
    it('devrait retourner la liste des utilisateurs avec un code de statut 200', async () => {
      // Simuler une requête GET vers la route /api/emp/userListe
      const response = await request(app)
        .get('/api/emp/userListe')
        .expect(200); // Attendu : Code de statut HTTP 200
  
      // Vérifier la réponse de la requête
      assert(Array.isArray(response.body)); // Attendu : La réponse est un tableau (liste d'utilisateurs)
      assert(response.body.length > 0); // Attendu : La liste des utilisateurs n'est pas vide
  
      // Vérifier si les utilisateurs ont les champs attendus
      const firstUser = response.body[0];
      assert(firstUser._id); // Attendu : Chaque utilisateur a un ID
      assert(firstUser.name); // Attendu : Chaque utilisateur a un nom
      assert(firstUser.email); // Attendu : Chaque utilisateur a un email
      assert(firstUser.role); // Attendu : Chaque utilisateur a un rôle
    });
  
    it('devrait renvoyer une erreur si une erreur survient lors de la récupération des utilisateurs', async () => {
      // Simuler une erreur en changeant le nom du modèle (par exemple)
      Emp.modelName = 'Users';
  
      // Simuler une requête GET vers la route /api/emp/userListe
      const response = await request(app)
        .get('/api/emp/userListe')
        .expect(500); // Attendu : Code de statut HTTP 500
  
      // Rétablir le nom du modèle Emp pour les autres tests
      Emp.modelName = 'Emp';
  
      // Vérifier si l'API renvoie un message d'erreur
      assert(response.body.error);
    });
  });

describe('DELETE /api/emp/deleteEmp/:id', () => {
  let empId;

  before(async () => {
    // Créer un nouvel employé pour les tests
    const newEmp = new Emp({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      role: 'Software Engineer'
    });
    const savedEmp = await newEmp.save();
    empId = savedEmp._id;
  });

  it('devrait supprimer un employé existant', async () => {
    const response = await request(app)
      .delete(`/api/emp/deleteEmp/${empId}`)
      .expect(200);

    assert.strictEqual(response.body.message, 'Employé supprimé avec succès');

    // Vérifier si l'employé a été supprimé de la base de données
    const deletedEmp = await Emp.findById(empId);
    assert.strictEqual(deletedEmp, null);
  });

  it('devrait renvoyer une erreur si l\'employé n\'existe pas', async () => {
    const fakeId = '123456789012345678901234'; // ID qui n'existe pas

    const response = await request(app)
      .delete(`/api/emp/deleteEmp/${fakeId}`)
      .expect(404);

    assert.strictEqual(response.body.error, 'Employé non trouvé');
  });
});
