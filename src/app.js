// 1. Importaciones necesarias (incluyendo 'cors')
import express from "express";
import cors from "cors"; // <-- ¡Añadir la importación de CORS!
import { connectMySQL } from "./config/mysql.config.js";
import principalRoutes from "./routes/principal.routes.js";

const app = express();

// 2. CONFIGURACIÓN DE CORS
// Definimos los orígenes permitidos (solo tu frontend)
const corsOptions = {
  // Origen de tu frontend: http://localhost:5173
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Aplicar el middleware de CORS antes de tus rutas
app.use(cors(corsOptions));
// -----------------------------------------------------

// 3. Middlewares restantes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba conexión MySQL
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

// Montar las rutas principales
app.use("/", principalRoutes);

// Manejo para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
  console.log(
    "CORS configurado para aceptar peticiones desde http://localhost:5173"
  );
});


// // src/app.js
// import express from "express";
// import { connectMySQL } from "./config/mysql.config.js";
// import principalRoutes from "./routes/principal.routes.js"; // ✅ Import correcto

// const app = express();

// // ✅ Middlewares
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
// // app.use("/", principalRoutes)

// // ❌ Manejo para rutas no encontradas
// app.use((req, res) => {
//   res.status(404).json({ error: "Ruta no encontrada" });
// });

// // ✅ Iniciar servidor
// app.listen(8080, () => {
//   console.log("🚀 Server running on http://localhost:8080");
// });
