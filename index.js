const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");
require("dotenv").config();

// Crea el servidor de express
const app = express();

// Lectura y parseo del body
app.use(express.json());

// BBDD
dbConnection();

// CORS
app.use(cors());

// Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

// Directorio Publico
app.use(express.static("public"));

// Escuchar peticiones
app.listen(process.env.PORT, () =>
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
);
