// src/models/user.model.js
import { connectMySQL } from "../config/mysql.config.js";

/* ============================================================
   Crear un usuario nuevo en la base de datos
   ============================================================ */
export const createUser = async (
  nombre,
  email,
  password,
  idEstado,
  idRol
) => {
  const connection = await connectMySQL();

  try {
    const query = `
      INSERT INTO usuario (nombre, email, password, idEstado, idRol)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      nombre,
      email,
      password,
      idEstado,
      idRol,
    ]);

    return {
      idUsuario: result.insertId,
      nombre,
      email,
      idEstado,
      idRol,
    };
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    throw new Error("Error al insertar usuario en la base de datos.");
  } finally {
    await connection.end();
  }
};


/* ============================================================
   Consultar un usuario por su ID
   ============================================================ */
export const getUserById = async (idUsuario) => {
  const connection = await connectMySQL();
  try {
    const [rows] = await connection.execute(
      `SELECT u.idUsuario, u.nombre, u.email, u.password,
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


/* ============================================================
   Consultar todos los usuarios
   ============================================================ */
export const getAllUsers = async () => {
  const connection = await connectMySQL();
  try {
    const [rows] = await connection.execute(
      `SELECT u.idUsuario, u.nombre, u.email, u.password,
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


/* ============================================================
   Consultar un usuario por su correo electrónico
   ============================================================ */
export const getUserByEmail = async (email) => {
  const connection = await connectMySQL();
  try {
    const [rows] = await connection.execute(
      `SELECT u.idUsuario, u.nombre, u.email, u.password,
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


/* ============================================================
   Actualizar un usuario por su ID
   (Solo actualiza los campos enviados)
   ============================================================ */
export const updateUser = async (idUsuario, data) => {
  const connection = await connectMySQL();
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

    if (data.password) {
      fields.push("password = ?");
      values.push(data.password);
    }

    if (data.idEstado) {
      fields.push("idEstado = ?");
      values.push(data.idEstado);
    }

    if (data.idRol) {
      fields.push("idRol = ?");
      values.push(data.idRol);
    }

    // Si no hay campos para actualizar, retornar false
    if (fields.length === 0) return false;

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
    await connection.end();
  }
};


/* ============================================================
   Eliminar un usuario por su ID
   ============================================================ */
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

// export const createUser = async (
//   nombre,
//   email,
//   password,
//   idEstado,
//   idRol
// ) => {
//   const connection = await connectMySQL();

//   try {
//     const query = `
//       INSERT INTO usuario (nombre, email, password, idEstado, idRol)
//       VALUES (?, ?, ?, ?, ?)
//     `;

//     const [result] = await connection.execute(query, [
//       nombre,
//       email,
//       password,
//       idEstado,
//       idRol,
//     ]);

//     return {
//       idUsuario: result.insertId,
//       nombre,
//       email,
//       idEstado,
//       idRol,
//     };
//   } catch (error) {
//     console.error("❌ Error al crear usuario:", error);
//     throw new Error("Error al insertar usuario en la base de datos.");
//   } finally {
//     await connection.end();
//   }
// };


// export const getUserById = async (idUsuario) => {
//   const connection = await connectMySQL();
//   try {
//     const [rows] = await connection.execute(
//       `SELECT u.idUsuario, u.nombre, u.email, u.password,
//               e.nombre AS estado, r.nombreRol AS rol
//        FROM usuario u
//        JOIN estado e ON u.idEstado = e.idEstado
//        JOIN rol r ON u.idRol = r.idRol
//        WHERE u.idUsuario = ?`,
//       [idUsuario]
//     );
//     return rows[0] || null;
//   } finally {
//     await connection.end();
//   }
// };


// export const getAllUsers = async () => {
//   const connection = await connectMySQL();
//   try {
//     const [rows] = await connection.execute(
//       `SELECT u.idUsuario, u.nombre, u.email, u.password,
//               e.nombre AS estado, r.nombreRol AS rol
//        FROM usuario u
//        JOIN estado e ON u.idEstado = e.idEstado
//        JOIN rol r ON u.idRol = r.idRol`
//     );
//     return rows;
//   } finally {
//     await connection.end();
//   }
// };


// export const getUserByEmail = async (email) => {
//   const connection = await connectMySQL();
//   try {
//     const [rows] = await connection.execute(
//       `SELECT u.idUsuario, u.nombre, u.email, u.password,
//               e.nombre AS estado, r.nombreRol AS rol
//        FROM usuario u
//        JOIN estado e ON u.idEstado = e.idEstado
//        JOIN rol r ON u.idRol = r.idRol
//        WHERE u.email = ?`,
//       [email]
//     );
//     return rows[0] || null;
//   } finally {
//     await connection.end();
//   }
// };


// export const updateUser = async (idUsuario, data) => {
//   const connection = await connectMySQL();
//   try {
//     const fields = [];
//     const values = [];

//     if (data.nombre) {
//       fields.push("nombre = ?");
//       values.push(data.nombre);
//     }

//     if (data.email) {
//       fields.push("email = ?");
//       values.push(data.email);
//     }

//     if (data.password) {
//       fields.push("password = ?");
//       values.push(data.password);
//     }

//     if (data.idEstado) {
//       fields.push("idEstado = ?");
//       values.push(data.idEstado);
//     }

//     if (data.idRol) {
//       fields.push("idRol = ?");
//       values.push(data.idRol);
//     }

//     if (fields.length === 0) return false;

//     const query = `
//       UPDATE usuario
//       SET ${fields.join(", ")}
//       WHERE idUsuario = ?;
//     `;

//     values.push(idUsuario);

//     const [result] = await connection.execute(query, values);
//     return result.affectedRows > 0;
//   } catch (error) {
//     console.error("Error al actualizar usuario:", error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// };


// export const deleteUser = async (idUsuario) => {
//   const connection = await connectMySQL();
//   try {
//     const [result] = await connection.execute(
//       "DELETE FROM usuario WHERE idUsuario = ?",
//       [idUsuario]
//     );
//     return result.affectedRows > 0;
//   } finally {
//     await connection.end();
//   }
// };

