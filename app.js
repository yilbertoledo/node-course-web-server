const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 3000;

var app = express();

//Indicar a hbs donde ubicar los partials
hbs.registerPartials(__dirname + "/views/partials");

//Establecer el motor de vistas que usará express
app.set("view engine", "hbs");

//Registrar una función helper
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

//Registrar una función helper con parámetros
hbs.registerHelper("sayItLoud", text => {
  return text.toUpperCase();
});


//Express Middlewares
//2 - Middleware para registrar un log con todas las peticiones
app.use((req, resp, next) => {
  var now = new Date().toString();
  var logMsg = `${now}: ${req.method} ${req.url}`;
  console.log(logMsg);
  fs.appendFile("server.log", logMsg + "\n", err => {
    if (err) console.log(`Error trying to write log: ${err}`);
  });
  //Si no se invoca al método next no se podrá continuar con la ejecución de los demás middlewares
  next();
});

/*
//3 - Middleware para redireccionar a página de mantenimiento
app.use((req, resp, next) => {
  console.log("Go to maintenance");
  resp.render("maintenance.hbs", {
    pageTitle: "Maintenace Page"
  });
});
*/

//1 - Crear/usar una función middleware para servir contenido estático de un directorio específico
app.use(express.static(__dirname + "/public"));

//Establecer rutas
//Ruta con Respuesta en Text/HTML
app.get("/welcome", (request, respose) => {
  console.log("Go to welcome");
  respose.send("<h1> Hello World </h1>");
});

//Ruta con Respuesta en Json
app.get("/bad", (request, respose) => {
  console.log("Go to back");
  respose.send({
    status_code: "404",
    status_message: "Page what you looking for is missing.",
    alternatives: ["Go Home", "Search in Google"]
  });
});

//Ruta con Respuesta basada en el iew engine hbs (handledbars)
app.get("/about", (req, resp) => {
  console.log("Go to about");
  //No es necesario indicar el directorio views porque es el directorio por defecto de hbs
  resp.render("about.hbs", {
    pageTitle: "About Page!"
  });
});

app.get("/", (req, resp) => {
  console.log("Go to root");
  resp.render("home.hbs", {
    pageTitle: "Welcome Page!",
    welcomeMessage: `You think water moves fast? You should see ice. It moves like it has a mind.
    Like it knows it killed the world once and got a taste for murder.`
  });
});


//Iniciar escucha puerto 3000
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
