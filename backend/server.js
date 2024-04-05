// appeler les packages
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const emp = require("./api/emp");

// lancer module avec format json
const app = express();
app.use(express.json());
app.use(cors());

// appeler chemin de connexion
const mongo_url = config.get("mongo_url");
// lancer des script sur mongoose --> permet l'interraction avec mango
mongoose.set("strictQuery",true);

// verifier la connection
mongoose.connect(mongo_url,{useNewUrlParser : true, useUnifiedTopology : true})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch((err) =>console.log(err));

app.use("/api/emp", emp);

const port = process.env.PORT||3001; 
app.listen(port,()=>console.log(`server is runing on port ${port}`));
