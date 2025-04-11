const express = require('express');
const pool = require('./db'); 
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 6666;

app.listen(PORT, () => {
  console.log('Servidor corriendo');
});

app.get('/api/prueba', (req, res) => {
  res.send('api funcionando');
});

app.get('/api/prueba1', (req, res) => {
  res.status(200).json({
    message: 'La API RESPONDE CORRECTAMENTE',
    port: PORT,
    status: 'success'
  });
});

app.post('/api/registro', async (req, res) => {
  const { cedula, nombre, edad, profesion } = req.body;

  try {
    const query = 'INSERT INTO persona (cedula, nombre, edad, profesion) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [cedula, nombre, edad, profesion]);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      data: { cedula, nombre, edad, profesion }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creando el usuario',
      error: error.message
    });
  }
});

app.get('/api/mostrar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM persona');

    res.status(200).json({
      connection: true,
      message: 'Registros obtenidos correctamente',
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      connection: false,
      message: 'Error al recorrer',
      details: error.message
    });
  }
});

app.delete('/api/eliminar/:cedula', async (req, res) => {
  const { cedula } = req.params;

  try {
    const result = await pool.query('DELETE FROM persona WHERE cedula = $1', [cedula]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No se encontró un usuario con esa cédula' });
    }

    res.status(200).json({
      message: 'Usuario eliminado correctamente',
      cedula: cedula
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el usuario',
      error: error.message
    });
  }
});
app.put('/api/actualizar/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const { nombre, edad, profesion } = req.body;

  try {
    const result = await pool.query(
      'UPDATE persona SET nombre = $1, edad = $2, profesion = $3 WHERE cedula = $4',
      [nombre, edad, profesion, cedula]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No se encontró un usuario con esa cédula' });
    }

    res.status(200).json({
      message: 'Usuario actualizado correctamente',
      data: { cedula, nombre, edad, profesion }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el usuario',
      error: error.message
    });
  }
});




