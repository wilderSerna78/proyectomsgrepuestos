// 1. Importaciones necesarias
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectMySQL } from "./config/mysql.config.js";
import principalRoutes from "./routes/principal.routes.js";

// 2. Cargar variables de entorno
dotenv.config();

const app = express();

// 3. Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // 👈 configurable desde .env si lo deseas
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// 4. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Ruta de prueba de conexión a MySQL
app.get("/test-db", async (req, res) => {
  try {
    const connection = await connectMySQL();
    const [rows] = await connection.query(
      "SELECT NOW() AS fecha, DATABASE() AS bd"
    );
    res.json({ message: "✅ Conexión MySQL exitosa", data: rows });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Manejo de cookies
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // tu frontend
    credentials: true, // 👈 permite enviar cookies
  })
);

// 7. Rutas principales
app.use("/", principalRoutes);

// 8. Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 9. Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(
    `🌐 CORS configurado para aceptar peticiones desde ${corsOptions.origin}`
  );
});

// // 1. Importaciones necesarias (incluyendo 'cors')
// import express from "express";
// import cors from "cors"; // <-- ¡Añadir la importación de CORS!
// import { connectMySQL } from "./config/mysql.config.js";
// import principalRoutes from "./routes/principal.routes.js";

// const app = express();

// // 2. CONFIGURACIÓN DE CORS
// // Definimos los orígenes permitidos (solo tu frontend)
// const corsOptions = {
//   // Origen de tu frontend: http://localhost:5173
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// // Aplicar el middleware de CORS antes de tus rutas
// app.use(cors(corsOptions));
// // -----------------------------------------------------

// // 3. Middlewares restantes
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Ruta de prueba conexión MySQL
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

// // Montar las rutas principales
// app.use("/", principalRoutes);

// // Manejo para rutas no encontradas
// app.use((req, res) => {
//   res.status(404).json({ error: "Ruta no encontrada" });
// });

// // Iniciar servidor
// app.listen(8080, () => {
//   console.log("🚀 Server running on http://localhost:8080");
//   console.log(
//     "CORS configurado para aceptar peticiones desde http://localhost:5173"
//   );
// });
