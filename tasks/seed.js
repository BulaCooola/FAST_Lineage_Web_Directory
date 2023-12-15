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
const PrettyPrettyPrincesses = await line.createLine("Pretty Pretty Princesses");
console.log('PPP line created');

const MILF = await line.createLine(`Mya's Infinite Line Friends`);
console.log('MILF line created');

const dankest = await line.createLine('Dankest');
console.log('Dankest line created');

const grand = await line.createLine('Grand');
console.log('Grand line created');

const suave = await line.createLine('Suave');
console.log('Suave line created');

const LaurenEspinelli = await user.registerUser('lespinelli', 'Lauren', 'Espinelli', 'lespinelli@stevens.edu', 'Test@123', 'Test@123', 'Suave')
const LEspinelli = await user.getUserByEmail('lespinelli@stevens.edu')
const addLEspinelli = await line.addMember(LEspinelli.line, LEspinelli);
console.log('lespinelli registered and added');

const RussellSanglang = await user.registerUser("rsanglang", "Russell", "Sanglang", "rsanglang@stevens.edu", "Test@123", "Test@123", 'Pretty Pretty Princesses');
const RSanglang = await user.getUserByEmail("rsanglang@stevens.edu");
console.log('rsanglang registered and added');
const updatePPPHead = await line.addLineHead(RSanglang, 'Pretty Pretty Princesses');
console.log('rsanglang now head of PPP');

const DylanTran = await user.registerUser("dtran", "Dylan", "Tran", "dtran@stevens.edu", "Test@123", "Test@123", 'Dankest');
const DTran = await user.getUserByEmail("dtran@stevens.edu");
const addDTran = await line.addMember(DTran.line, DTran);
console.log('dtran registered and added');

const EdmundYuen = await user.registerUser("eyuen", "Edmund", "Yuen", "eyuen@stevens.edu", "Test@123", "Test@123", 'Grand');
const EYuen = await user.getUserByEmail("eyuen@stevens.edu");
const addEYuen = await line.addMember(EYuen.line, EYuen);
console.log('eyuen registered and added');

const MyaPhu = await user.registerUser("mphu", "Mya", "Phu", "mphu@stevens.edu", "Test@123", "Test@123", `Mya's Infinite Line Friends`);
const MPhu = await user.getUserByEmail("mphu@stevens.edu");
console.log('mphu registered and added');
const updateMILFHead = await line.addLineHead(MPhu, `Mya's Infinite Line Friends`);
console.log(`mphu now head of Mya's Infinite Line Friends`);

const SeanPayba = await user.registerUser("spayba", "Sean", "Payba", "spayba@stevens.edu", "Test@123", "Test@123", `Mya's Infinite Line Friends`);
const SPayba = await user.getUserByEmail("spayba@stevens.edu");
const addSPayba = await line.addMember(SPayba.line, SPayba);
const addSPaybas = await line.addMember(SPayba.line, SPayba);

console.log('spayba registered and added');

const BrandenBulatao = await user.registerUser('bbulatao', 'Branden', 'Bulatao', 'bbulatao@stevens.edu', "Test@123", "Test@123", `Mya's Infinite Line Friends`);
const BBulatao = await user.getUserByEmail("bbulatao@stevens.edu");
const addBBulatao = await line.addMember(BBulatao.line, BBulatao);
console.log('bbulatao registered and added');

const BelalEltemsah = await user.registerUser('beltemsah', 'Belal', 'Eltemsah', 'beltemsah@stevens.edu', 'Test@123', 'Test@123', `Mya's Infinite Line Friends`);
const BEltemsah = await user.getUserByEmail('beltemsah@stevens.edu');
const addBEltemsah = await line.addMember(BEltemsah.line, BEltemsah)
console.log('beltemsah registered and added');

console.log('Done Seeding')
await closeConnection();