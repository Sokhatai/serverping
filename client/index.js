var http = require('node:http');
const prompt = require('prompt-sync')();

// Demande les identifiants de l'utilisateur
const username = prompt('Login ? ');
const password = prompt('Mot de passe ? ');
console.log(username + password);

// Connexion pour obtenir le token
fetch("http://localhost:3001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
})
.then((res) => res.json())
.then((data) => {
    if (data.token) {
        // Si le token est reçu, récupérer les Pokémon
        fetch("http://localhost:3001/pokemon", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.token}`
          }
      })
      .then((res) => {
          // Vérifier si la réponse est "OK" (code 200)
          if (!res.ok) {
              // Afficher une erreur si le statut n'est pas 200
              throw new Error(`Erreur HTTP: ${res.status} ${res.statusText}`);
          }
          return res.json(); // Convertir la réponse en JSON seulement si le statut est "OK"
      })
      .then((data) => console.log(data)) // Afficher les données JSON
      .catch((error) => console.error('Erreur lors de la récupération des Pokémon:', error)); // Gérer les erreurs
    }});