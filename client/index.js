var http = require('node:http');
const prompt = require('prompt-sync')();


// On crée un serveur web (http), qui, pour toute requête (req),
const username = prompt('Login ? ');
const password = prompt('Mot de passe ? ');
console.log(login + mdp);
const token = await fetch("http://localhost:3001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  })
    .then( (res) => res.json());

fetch("http://localhost:3001/pokemon",{
    method: "get",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        token
    })
  })
    .then((res) => res.json())
    .then((res) => console.log(res));