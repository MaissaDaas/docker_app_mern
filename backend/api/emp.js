const router = require("express").Router();
const Emp = require("../Models/user");


// Route pour ajouter un employé
router.post('/ajouterEmp', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Créer une nouvelle instance de l'employé
    const newEmp = new Emp({
      name,
      email,
      role
    });

    // Enregistrer l'employé dans la base de données
    const savedEmp = await newEmp.save();

    res.json(savedEmp);
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// @route GET api/emp/userListe
// @desc Afficher la liste des users
// @access Private && ADMIN
router.get('/userListe', async (req, res) => {
  try {
    const users = await Emp.find({});
    console.log('Utilisateurs récupérés avec succès:', users);

    res.json(users);
  } catch (error) {
    console.error('Internal Server Error:', error.message);

    res.status(500).json({ error: error.message });
  }
});

router.get('/empListe', async (req, res) => {
  try {
    const users = await Emp.find({});
    console.log('Utilisateurs récupérés avec succès:', users);
    res.json(users);
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).json({ error: error.message });  
  }
});

// @route DELETE api/emp/deleteEmp/:id
// @desc Supprimer un employé par son ID
// @access Public
router.delete('/deleteEmp/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Chercher l'employé par ID et le supprimer de la base de données
    const deletedEmp = await Emp.findByIdAndDelete(id);

    if (!deletedEmp) {
      return res.status(404).json({ error: 'Employé non trouvé' });
    }

    res.json({ message: 'Employé supprimé avec succès', deletedEmp });
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/empListe', async (req, res) => {
  try {
    const users = await Emp.find({});
    console.log('Utilisateurs récupérés avec succès:', users);
    res.json(users);
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).json({ error: error.message });  
  }
});


module.exports = router;

