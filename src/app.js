// 1. Importaciones
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectMySQL } from "./config/mysql.config.js";
import principalRoutes from "./routes/principal.routes.js";

// 2. Variables de entorno
dotenv.config();

const app = express();

// 3. Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Configuración de CORS (UNIFICADA Y CORRECTA)
const allowedOrigins = [
  "http://localhost:5173",   // Web (Vite)
  "http://10.0.2.2:8080",    // Flutter Android Emulator
  "http://127.0.0.1:8080"    // Por seguridad adicional
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir herramientas como Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("⛔ Origen bloqueado por CORS:", origin);
      return callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 5. Ruta de prueba MySQL
app.get("/test-db", async (req, res) => {
  try {
    const connection = await connectMySQL();
    const [rows] = await connection.query(
      "SELECT NOW() AS fecha, DATABASE() AS bd"
    );
    await connection.end();
    res.json({ message: "✅ Conexión MySQL exitosa", data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Rutas principales
app.use("/", principalRoutes);

// 7. Logs de depuración para peticiones Flutter
app.use((req, res, next) => {
  console.log("📥 Request:", {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers['user-agent']
  });
  next();
});

// 8. 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 9. Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("🌐 CORS listo para Flutter y Web");
});


// // 1. Importaciones necesarias
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import { connectMySQL } from "./config/mysql.config.js";
// import principalRoutes from "./routes/principal.routes.js";

// // 2. Cargar variables de entorno
// dotenv.config();

// const app = express();

// // 3. Configuración de CORS
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || "http://localhost:5173", // 👈 configurable desde .env si lo deseas
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
// app.use(cors(corsOptions));

// // 4. Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 5. Ruta de prueba de conexión a MySQL
// app.get("/test-db", async (req, res) => {
//   try {
//     const connection = await connectMySQL();
//     const [rows] = await connection.query(
//       "SELECT NOW() AS fecha, DATABASE() AS bd"
//     );
//     res.json({ message: "✅ Conexión MySQL exitosa", data: rows });
//     await connection.end();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 6. Manejo de cookies
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // tu frontend
//     credentials: true, // 👈 permite enviar cookies
//   })
// );

// // 7. Rutas principales
// app.use("/", principalRoutes);

// // 8. Manejo de rutas no encontradas
// app.use((req, res) => {
//   res.status(404).json({ error: "Ruta no encontrada" });
// });

// // 9. Iniciar servidor
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
//   console.log(
//     `🌐 CORS configurado para aceptar peticiones desde ${corsOptions.origin}`
//   );
// });
