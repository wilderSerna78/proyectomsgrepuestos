import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // 👈 Cargar variables del archivo .env

// 🔗 Conexión a MySQL
export const connectMySQL = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,       // Servidor desde .env
      port: process.env.DB_PORT,       // Puerto desde .env
      user: process.env.DB_USER,       // Usuario desde .env
      password: process.env.DB_PASSWORD, // Contraseña desde .env
      database: process.env.DB_NAME,   // Nombre de la BD desde .env
    });

    console.log("✅ Conectado a MySQL correctamente");
    return connection;
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);
    throw error;
  }
};


// import mysql from "mysql2/promise";

// // Conexión a MySQL
// export const connectMySQL = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: "localhost", // Servidor
//       port: 3306, // Puerto de MySQL
//       user: "root", // Usuario
//       password: "", // Contraseña (si tienes)
//       database: "meacsoftwaredb", // Nombre de la BD
//     });

//     console.log("✅ Conectado a MySQL");
//     return connection;
//   } catch (error) {
//     console.error("❌ Error conectando a MySQL:", error.message);
//     throw error;
//   }
// };
