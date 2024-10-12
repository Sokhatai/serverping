var http = require('node:http');
const prompt = require('prompt-sync')();


// On crée un serveur web (http), qui, pour toute requête (req),
let username = prompt('Login ? ');
let password = prompt('Mot de passe ? ');
console.log(login + mdp);
fetch("http://localhost:3001/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  })
    .then( (res) => res.json())
    .then((donnee) => console.log(donnee));