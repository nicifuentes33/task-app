const User = require('../models/User');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

// REGISTER 
exports.register = async (req, res) => {

  try {

    console.log('REGISTER BODY =>', req.body);

    const {
      name,
      email,
      password
    } = req.body;

    // VALIDATION 
    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    // CHECK USER 
    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {

      return res.status(400).json({
        message: 'El usuario ya existe'
      });
    }

    // HASH PASSWORD 
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER 
    const user = new User({

      name,

      email,

      password: hashedPassword
    });

    //  SAVE USER 
    await user.save();

    console.log('USUARIO CREADO');

    // RESPONSE 
    res.status(201).json({
      message: 'Usuario creado correctamente'
    });

  } catch (error) {

    console.log('REGISTER ERROR =>', error);

    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });
  }
};

// LOGIN 
exports.login = async (req, res) => {

  try {

    console.log('LOGIN BODY =>', req.body);

    const {
      email,
      password
    } = req.body;

    //  VALIDATION 
    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    // FIND USER 
    const user = await User.findOne({
      email
    });

    if (!user) {

      return res.status(400).json({
        message: 'Usuario no encontrado'
      });
    }

    // VALIDATE PASSWORD 
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {

      return res.status(400).json({
        message: 'Contraseña incorrecta'
      });
    }

    // GENERATE TOKEN 
    const token = jwt.sign(

      {
        id: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '1d'
      }
    );

    console.log('LOGIN EXITOSO');

    //  RESPONSE 
    res.json({
      token
    });

  } catch (error) {

    console.log('LOGIN ERROR =>', error);

    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });
  }
};