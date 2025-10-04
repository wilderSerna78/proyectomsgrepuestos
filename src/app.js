// src/app.js
import express from "express";
import { connectMySQL } from "./config/mysql.config.js";
import principalRoutes from "./routes/principal.routes.js"; // ✅ Import correcto

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ruta de prueba conexión MySQL
app.get("/test-db", async (req, res) => {
  try {
    const connection = await connectMySQL();
    const [rows] = await connection.query(
      "SELECT NOW() AS fecha, DATABASE() AS bd"
    );
    res.json({ message: "✅ Conexión exitosa", data: rows });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Montar las rutas principales
app.use("/", principalRoutes);
// app.use("/", principalRoutes)

// ❌ Manejo para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// ✅ Iniciar servidor
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});

// // src/app.js
// import express from "express";
// import { connectMySQL } from "./config/mysql.config.js";
// import principalRoutes from "./routes/principal.routes.js"; // ✅ import correcto

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Ruta de prueba conexión MySQL
// app.get("/test-db", async (req, res) => {
//   try {
//     const connection = await connectMySQL();
//     const [rows] = await connection.query(
//       "SELECT NOW() AS fecha, DATABASE() AS bd"
//     );
//     res.json({ message: "✅ Conexión exitosa", data: rows });
//     await connection.end();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ✅ Montar las rutas principales
// app.use("/", principalRoutes);

// app.listen(8080, () => {
//   console.log("🚀 Server on port 8080");
// });
