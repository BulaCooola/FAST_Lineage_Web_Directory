import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import line from '../data/lines.js'
import user from '../data/users.js'

//Test Connection to Database

const db = await dbConnection();
await db.dropDatabase();

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

const RussellSanglang = await user.registerUser("rsanglang", "Russell", "Sanglang", "rsanglang@stevens.edu", "Test@123", "Test@123");
console.log('rsanglang registered')

const pppHead = await user.getUserByEmail("rsanglang@stevens.edu")
console.log('rsanglang now head of PPP')

const PrettyPrettyPrincesses = await line.createLine("Pretty Pretty Princesses", pppHead)
console.log('PPP line created')

const DylanTran = await user.registerUser("dtran", "Dylan", "Tran", "dtran@stevens.edu", "Test@123", "Test@123");
console.log('dtran registered')

const EdmundYuen = await user.registerUser("eyuen", "Edmund", "Yuen", "eyuen@stevens.edu", "Test@123", "Test@123");
console.log('eyuen registered')

const MyaPhu = await user.registerUser("mphu", "Mya", "Phu", "mphu@stevens.edu", "Test@123", "Test@123");
console.log('mphu registered')

const SeanPayba = await user.registerUser("spayba", "Sean", "Payba", "spayba@stevens.edu", "Test@123", "Test@123")
console.log('spayba registered')

const BrandenBulatao = await user.registerUser('bbulatao', 'Branden', 'Bulatao', 'bbulatao@stevens.edu', "Test@123", "Test@123")
console.log('bbulatao registered')

const MILFHead = await user.getUserByEmail("mphu@stevens.edu")
console.log('mphu now head of MILF')

const MILF = await line.createLine("MILF", MILFHead)
console.log('MILF line created')

console.log('Done Seeding')
await closeConnection();