
const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokemonsRouter = require('./pokemonsRouter')
const typesRouter = require('./typesRouter')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/pokemons',pokemonsRouter)
router.use('/types', typesRouter)
// router.get("/pokemons", (req,res)=>{
//  res.send("soy pokemons")

// })
module.exports = router;
