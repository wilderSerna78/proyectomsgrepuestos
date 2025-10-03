import express from "express";
import { connectMySQL } from "./config/mysql.config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba para verificar conexión a MySQL
app.get("/test-db", async (req, res) => {
  try {
    const connection = await connectMySQL();
    const [rows] = await connection.query("SELECT NOW() AS fecha, DATABASE() AS bd");
    res.json({ message: "✅ Conexión exitosa", data: rows });
    await connection.end(); // cerrar la conexión después de usarla
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ejemplo: listar usuarios desde MySQL
app.get("/usuarios", async (req, res) => {
  try {
    const connection = await connectMySQL();
    const [rows] = await connection.query("SELECT * FROM Usuario");
    res.json(rows);
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8080, () => {
  console.log("🚀 Server on port 8080");
});


// import express from "express";

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ express: true }));



// app.listen(8080, () => {
//   console.log("Server on port 8080");
// });
