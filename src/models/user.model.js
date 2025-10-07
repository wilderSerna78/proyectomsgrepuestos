// src/models/user.model.js
import { connectMySQL } from "../config/mysql.config.js";

export const createUser = async (
  nombre,
  email,
  contrasena,
  idEstado,
  idRol
) => {
  const connection = await connectMySQL();
  try {
    const [result] = await connection.execute(
      `INSERT INTO usuario (nombre, email, contrasena, idEstado, idRol) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, email, contrasena, idEstado, idRol]
    );
    return { idUsuario: result.insertId, nombre, email, idEstado, idRol };
  } finally {
    await connection.end();
  }
};

export const getUserById = async (idUsuario) => {
  const connection = await connectMySQL();
  try {
    const [rows] = await connection.execute(
      `SELECT u.idUsuario, u.nombre, u.email, u.contrasena,
              e.nombre AS estado, r.nombreRol AS rol
       FROM usuario u
       JOIN estado e ON u.idEstado = e.idEstado
       JOIN rol r ON u.idRol = r.idRol
       WHERE u.idUsuario = ?`,
      [idUsuario]
    );
    return rows[0] || null;
  } finally {
    await connection.end();
  }
};

export const getAllUsers = async () => {
  const connection = await connectMySQL();
  try {
    const [rows] = await connection.execute(
      `SELECT u.idUsuario, u.nombre, u.email, u.contrasena,
              e.nombre AS estado, r.nombreRol AS rol
       FROM usuario u
       JOIN estado e ON u.idEstado = e.idEstado
       JOIN rol r ON u.idRol = r.idRol`
    );
    return rows;
  } finally {
    await connection.end();
  }
};

export const getUserByEmail = async (email) => {
  const connection = await connectMySQL();
  try {
    const [rows] = await connection.execute(
      `SELECT u.idUsuario, u.nombre, u.email, u.contrasena,
              e.nombre AS estado, r.nombreRol AS rol
       FROM usuario u
       JOIN estado e ON u.idEstado = e.idEstado
       JOIN rol r ON u.idRol = r.idRol
       WHERE u.email = ?`,
      [email]
    );
    return rows[0] || null;
  } finally {
    await connection.end();
  }
};

export const updateUser = async (idUsuario, data) => {
  const connection = await connectMySQL(); // ✅ Abre la conexión
  try {
    const fields = [];
    const values = [];

    if (data.nombre) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }

    if (data.email) {
      fields.push("email = ?");
      values.push(data.email);
    }

    if (data.contrasena) {
      fields.push("contrasena = ?");
      values.push(data.contrasena);
    }

    if (data.idEstado) {
      fields.push("idEstado = ?");
      values.push(data.idEstado);
    }

    if (data.idRol) {
      fields.push("idRol = ?");
      values.push(data.idRol);
    }

    if (fields.length === 0) {
      return false;
    }

    const query = `
      UPDATE usuario
      SET ${fields.join(", ")}
      WHERE idUsuario = ?;
    `;

    values.push(idUsuario);

    const [result] = await connection.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  } finally {
    await connection.end(); // ✅ Cierra la conexión
  }
};

// export const updateUser = async (idUsuario, data) => {
//   const connection = await connectMySQL();
//   try {
//     // 1. Obtener las claves y valores de los datos que sí llegaron
//     const fields = Object.keys(data); // ['email', 'idEstado']
//     const values = Object.values(data); // ['nuevo.email@ejemplo.com', 1]

//     // 2. Si no hay campos para actualizar, sale de la función
//     if (fields.length === 0) {
//       return false;
//     }

//     // 3. Construir la parte SET de la consulta dinámicamente:
//     //    Ejemplo: "SET email = ?, idEstado = ?"
//     const setClauses = fields.map((field) => `${field} = ?`).join(", ");

//     // 4. Los valores de la consulta son los valores de los campos + el idUsuario
//     const queryValues = [...values, idUsuario];

//     const [result] = await connection.execute(
//       `UPDATE usuario SET ${setClauses} WHERE idUsuario = ?`,
//       queryValues
//     );

//     return result.affectedRows > 0;
//   } finally {
//     await connection.end();
//   }
// };
export const deleteUser = async (idUsuario) => {
  const connection = await connectMySQL();
  try {
    const [result] = await connection.execute(
      "DELETE FROM usuario WHERE idUsuario = ?",
      [idUsuario]
    );
    return result.affectedRows > 0;
  } finally {
    await connection.end();
  }
};

// // src/models/user.model.js
// import { connectMySQL } from "../config/mysql.config.js";

// // Crear usuario
// export const createUser = async (
//   nombre,
//   email,
//   contraseña,
//   idEstado,
//   idRol
// ) => {
//   const connection = await connectMySQL();
//   const [result] = await connection.execute(
//     `INSERT INTO usuario (nombre, email, contraseña, idEstado, idRol)
//      VALUES (?, ?, ?, ?, ?)`,
//     [nombre, email, contraseña, idEstado, idRol]
//   );
//   await connection.end();
//   return { idUsuario: result.insertId, nombre, email, idEstado, idRol };
// };

// // Obtener usuario por ID (JOIN con estado y rol)
// export const getUserById = async (idUsuario) => {
//   const connection = await connectMySQL();
//   const [rows] = await connection.execute(
//     `SELECT u.idUsuario, u.nombre, u.email, u.contraseña,
//             e.nombre AS estado, r.nombreRol AS rol
//      FROM usuario u
//      JOIN estado e ON u.idEstado = e.idEstado
//      JOIN rol r ON u.idRol = r.idRol
//      WHERE u.idUsuario = ?`,
//     [idUsuario]
//   );
//   await connection.end();
//   return rows[0] || null;
// };

// // Obtener todos los usuarios (JOIN con estado y rol)
// export const getAllUsers = async () => {
//   const connection = await connectMySQL();
//   const [rows] = await connection.execute(
//     `SELECT u.idUsuario, u.nombre, u.email, u.contraseña,
//             e.nombre AS estado, r.nombreRol AS rol
//      FROM usuario u
//      JOIN estado e ON u.idEstado = e.idEstado
//      JOIN rol r ON u.idRol = r.idRol`
//   );
//   await connection.end();
//   return rows;
// };

// // Buscar usuario por email
// export const getUserByEmail = async (email) => {
//   const connection = await connectMySQL();
//   const [rows] = await connection.execute(
//     `SELECT u.idUsuario, u.nombre, u.email, u.contraseña,
//             e.nombre AS estado, r.nombreRol AS rol
//      FROM usuario u
//      JOIN estado e ON u.idEstado = e.idEstado
//      JOIN rol r ON u.idRol = r.idRol
//      WHERE u.email = ?`,
//     [email]
//   );
//   await connection.end();
//   return rows[0] || null;
// };

// // Actualizar usuario
// export const updateUser = async (
//   idUsuario,
//   nombre,
//   email,
//   contraseña,
//   idEstado,
//   idRol
// ) => {
//   const connection = await connectMySQL();
//   const [result] = await connection.execute(
//     `UPDATE usuario
//      SET nombre = ?, email = ?, contraseña = ?, idEstado = ?, idRol = ?
//      WHERE idUsuario = ?`,
//     [nombre, email, contraseña, idEstado, idRol, idUsuario]
//   );
//   await connection.end();
//   return result.affectedRows > 0;
// };

// // Eliminar usuario
// export const deleteUser = async (idUsuario) => {
//   const connection = await connectMySQL();
//   const [result] = await connection.execute(
//     "DELETE FROM usuario WHERE idUsuario = ?",
//     [idUsuario]
//   );
//   await connection.end();
//   return result.affectedRows > 0;
// };
