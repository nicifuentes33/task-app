const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const authHeader = req.header('Authorization');

  // DEBUG: ver header completo
  console.log('🔐 AUTH HEADER =>', authHeader);

  if (!authHeader) {
    console.log('❌ NO AUTH HEADER');
    return res.status(401).json({
      message: 'Acceso denegado'
    });
  }

  //  Extraer token
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  // DEBUG: ver token ya limpio
  console.log('🧩 TOKEN EXTRAÍDO =>', token);

  try {

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    //  DEBUG: payload del token
    console.log('✅ TOKEN VÁLIDO =>', verified);

    req.user = verified;

    next();

  } catch (error) {

    // DEBUG ERROR REAL
    console.log('💥 JWT ERROR =>', error.message);

    return res.status(400).json({
      message: 'Token inválido'
    });
  }
};