const {Router} = require('express')
const axios = require('axios')
const router = Router()
const {Pokemon,Types} = require("../db")


const getApiData = async()=>{
	try{
		let stadarization = []
 const apiData = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=40')
 
 if(apiData.status===200){
	const datos = await apiData.data.results
	let rawdata = datos
	for(let i=0; i < rawdata.length;i++){
     if(!rawdata[i]) return stadarization
    if(rawdata[i].url){
     const pokemonaxios = await axios.get(rawdata[i].url)
     const pokemondata = pokemonaxios.data
	 stadarization.push({
     id: pokemondata.id,
	 name: pokemondata.name,
	 attack: pokemondata.stats[1].base_stat,
	 weight: pokemondata.weight,
	 height: pokemondata.height,
	 type: pokemondata.types.map(types => types.type.name),
	 img: pokemondata.sprites.front_shiny,
	 })

	}
	
	}
	return stadarization
 }
 
	}catch(error){return error.message}
}

const getDbData = async()=>{
try{
let db= await Pokemon.findAll({

	include: {model: Types , 
		attributes:['name']},


})

let normalizedb = await db.map( item =>{
 let formatter = {
  id: item.id,
  name: item.name,
  life: item.life,
  attack: item.attack,
  defense: item.defense,
  speed: item.speed,
  height: item.height,
  weight: item.weight,
  type: item.Types.map( type => type.name),
  img: item.img


 }
 
  return formatter

})

return normalizedb

}catch(error){ return error.message}



}

const allPokemons = async() =>{

let db  = await getDbData()

let api = await getApiData()
 let merge = [...db,...api]

 return merge

}


// router.get('/',async(req,res)=>{

// try{
// 	let pokedex = await allPokemons()
// 	res.status(200).send(pokedex)
     
// }catch(error){
// res.status(400).send(error.message)

// }


// })
router.get('/',async(req,res)=>{
	const{name}= req.query
	const{origin} = req.query
	try{
		let pokedex = await allPokemons()
		if(origin){
          let api = await getApiData()
		  let db = await getDbData()
          
         if(origin === "db") {
		if(db.length){return  res.status(200).send(db)} else{return res.status(404).send("Isn't any Pokemon on the database yet.")}
		if(origin === "api") {
			api.length ? res.status(200).send(api) :  res.status(404).send("We haven't received any Pokemon from the API")} 
         if(origin === "all")  return res.status(200).send(pokedex)
		}}
		if(name){
		
		let findname = pokedex.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
	findname.length ? res.status(200).send(findname) :  res.status(404).send("Pokemon not found.")
		} else{ res.status(200).send(pokedex)}
	}catch(error){
	res.send(error)
	
	}
	
	})

router.post('/',async(req,res)=>{
const{name,image,life,attack,defense,speed,height,weight,type} =req.body
const img = "https://i.imgur.com/FaQCkrU.png"
const pokecreate = await Pokemon.create({
name,
image,
life,
attack,
defense,
speed,
height,
weight,
img
})
console.log("llegue a ruta de express post pokemon")
console.log(type)
let associatedtypes = await Types.findAll({
where:{ name: type}
})

pokecreate.addTypes(associatedtypes)

})


router.get('/:id',async(req,res)=>{
const{id}=req.params
console.log(id)
try{
let pokedex = await allPokemons()
let finder = pokedex.find(item => item.id == id)
if(finder) return res.status(200).send(finder)
else{res.status(404).send("pokemon not found")}
}catch(error){

res.status(500).send(error.message)

}



})




module.exports = router


