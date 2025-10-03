import mysql from "mysql2/promise";

// Conexión a MySQL
export const connectMySQL = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost", // Servidor
      port: 3306, // Puerto de MySQL
      user: "root", // Usuario
      password: "", // Contraseña (si tienes)
      database: "meacsoftwaredb", // Nombre de la BD
    });

    console.log("✅ Conectado a MySQL");
    return connection;
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);
    throw error;
  }
};
