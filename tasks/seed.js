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

const DylanTran = await users.registerUser("dtran", "Dylan", "Tran", "dtran@stevens.edu", "password3", "password3");

const EdmundYuen = await users.registerUser("eyuen", "Edmund", "Yuen", "eyuen@stevens.edu", "password4", "password4");

const MyaPhu = await users.registerUser("mphu", "Mya", "Phu", "mphu@stevens.edu", "password2", "password2");

const SeanPayba = await users.registerUser("spayba", "Sean", "Payba", "spayba@stevens.edu", "password5", "password5")

const MILFHead = await users.getUserByEmail("mphu@stevens.edu")

const MILF = await lines.createLine("MILF", MILFHead)