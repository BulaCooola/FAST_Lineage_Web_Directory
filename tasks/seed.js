import { lines, users } from "../config/mongoConnection.js";
import lines from '../data/lines.js'
import users from '../data/users.js'

//Test Connection to Database

const db = await dbConnection();
try{
    await db.collection('users').drop();
}
catch(err){
    console.log(err)
}
try{
    await db.collection('lines').drop();
}
catch(err){
    console.log(err)
}

const RussellSanglang = await users.registerUser("rsanglang", "Russell", "Sanglang", "rsanglang@stevens.edu", "password1", "password1");

const pppHead = await users.getUserByEmail("rsanglang@stevens.edu")

const PrettyPrettyPrincesses = await lines.createLine("Pretty Pretty Princesses", pppHead)