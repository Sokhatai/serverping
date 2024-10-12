const express = require('express'); // pour créer le server http
const bcrypt = require('bcryptjs'); // pour parser les données afin de les manipulés
const mysql = require('mysql2'); // pour gérer les intéraction avec la db
const jwt = require('jsonwebtoken'); // pour les tokens d'authentifications et sessions d'users
const cors = require('cors'); // pour gérer les demandes d'autres ports

require('dotenv').config(); // pour gérer les fichiers .env

const app = express();
app.use(express.json());
app.use(cors());

// création de la connexion avec la DB
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
});

// gestion d'erreurs en cas de mauvaise connexion
db.connect((error) => {
    if (error) {
        console.log('Connexion echoue =', error);
        process.exit(1);
    }
    console.log('Connexion reussi !');
});

// verification des token JWT
function authJWT(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


// route pour enregistrer l'utilisateur et hasher le pwd
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPwd = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, hashedPwd], (error, result) => {
        if (error) {
            console.error('ERREUR DINSCRIPTION', error);
            return res.status(500).send('erreur serveur');
        }
        res.status(201).send('inscription succès');
    });
});

// route pour se connecter et verifier le pwd
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (error, result) => {
        if (error) return res.status(500).send('erreur serveur');
        if (result.length === 0) return res.status(400).send('utilisateur non présent');

        const user = result[0];
        const isPwdValid = await bcrypt.compare(password, user.password);
        if (!isPwdValid) return res.status(401).send('erreur de mot de passe');

        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
        res.json({ token });
    });
});

// route pour afficher les listes de pokemons depuis la DB
app.get('/pokemon', authJWT, (req, res) => {
    const sql = 'SELECT * FROM pokemon';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('les pokemons veulent pas apparaitre devant toi:', error);
            return res.status(500).send('erreur de serveur');
        }
        res.json(results);
    });
});

app.get('/', (req, res) => {
    res.send('le serveur est lancé');
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`connecté sur le port ${PORT}`);
});
