const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',     // usuario de PostgreSQL
    host: 'localhost',
    database: 'always_music',
    password: '11235', //  contraseña de PostgreSQL
    port: 5432,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

async function agregarEstudiante(estudiante) {
    const { nombre, rut, curso, nivel } = estudiante;
    const query = {
        text: 'INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4)',
        values: [nombre, rut, curso, nivel],
    };
    try {
        const res = await pool.query(query);
        console.log('Estudiante agregado:', res);
    } catch (err) {
        console.error('Error agregando estudiante:', err);
    }
}
async function consultarEstudiantePorRut(rut) {
    const query = {
        text: 'SELECT * FROM estudiantes WHERE rut = $1',
        values: [rut],
    };
    try {
        const res = await pool.query(query);
        console.log('Estudiante:', res.rows[0]);
    } catch (err) {
        console.error('Error consultando estudiante:', err);
    }
}
async function consultarEstudiantes() {
    const query = {
        text: 'SELECT * FROM estudiantes',
    };
    try {
        const res = await pool.query(query);
        console.log('Estudiantes:', res.rows);
    } catch (err) {
        console.error('Error consultando estudiantes:', err);
    }
}
async function actualizarEstudiante(estudiante) {
    const { nombre, rut, curso, nivel } = estudiante;
    const query = {
        text: 'UPDATE estudiantes SET nombre = $1, curso = $2, nivel = $3 WHERE rut = $4',
        values: [nombre, curso, nivel, rut],
    };
    try {
        const res = await pool.query(query);
        console.log('Estudiante actualizado:', res);
    } catch (err) {
        console.error('Error actualizando estudiante:', err);
    }
}
async function eliminarEstudiante(rut) {
    const query = {
        text: 'DELETE FROM estudiantes WHERE rut = $1',
        values: [rut],
    };
    try {
        const res = await pool.query(query);
        console.log('Estudiante eliminado:', res);
    } catch (err) {
        console.error('Error eliminando estudiante:', err);
    }
}

const [,, command, ...args] = process.argv;

switch (command) {
    case 'agregar':
        agregarEstudiante({
            nombre: args[0],
            rut: args[1],
            curso: args[2],
            nivel: parseInt(args[3])
        });
        break;
    case 'consultar':
        consultarEstudiantes();
        break;
    case 'consultar-rut':
        consultarEstudiantePorRut(args[0]);
        break;
    case 'actualizar':
        actualizarEstudiante({
            nombre: args[0],
            rut: args[1],
            curso: args[2],
            nivel: parseInt(args[3])
        });
        break;
    case 'eliminar':
        eliminarEstudiante(args[0]);
        break;
    default:
        console.log('Comando no reconocido');
}
