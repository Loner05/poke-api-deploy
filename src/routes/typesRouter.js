const { Router } = require("express");
const axios = require('axios');
const {Types} = require("../db")

const router = Router()

const cargarPeliculas = async() => {
	try {
		const respuesta = await axios("https://pokeapi.co/api/v2/type")
		//console.log(respuesta);

		// Si la respuesta es correcta
		if(respuesta.status === 200){
			const datos = await respuesta.data
			
	         return datos


		} 

	} catch(error){
		console.log(error);
	}

}

cargarPeliculas();


const repelia = async()=>{

 let pelia = await cargarPeliculas();

 return pelia

}



router.get('/', async (req,res)=>{
    let pelis = await cargarPeliculas()

   try{
    
    await pelis.results.map(item =>{
      Types.findOrCreate({
        where: { name : item.name }
          
      })

    })
    let db = await Types.findAll({
      raw : true,
        attributes: ["name"], 
        raw : true,
    })
    const dbnames = await db.map((r) => r.name)

 res.status(200).json(dbnames)
   }catch(error){
     res.status(400).send(error.message)

   }
   

})

module.exports = router