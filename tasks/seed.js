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

const LaurenEspineli = await user.registerUser('lespineli', 'Lauren', 'Espineli', 'lespineli@stevens.edu', 'Test@123', 'Test@123', 'Suave')
const LEspineli = await user.getUserByEmail('lespineli@stevens.edu')
const addLEspineli = await line.addMember(LEspineli.line, LEspineli);
console.log('lespineli registered and added');

const RussellSangalang = await user.registerUser("rsangalang", "Russell", "Sangalang", "rsangalang@stevens.edu", "Test@123", "Test@123", 'Pretty Pretty Princesses');
const RSangalang = await user.getUserByEmail("rsangalang@stevens.edu");
console.log('rsangalang registered and added');
const updatePPPHead = await line.addLineHead(RSangalang, 'Pretty Pretty Princesses');
console.log('rsangalang now head of PPP');

const DylanTran = await user.registerUser("dtran", "Dylan", "Tran", "dtran@stevens.edu", "Test@123", "Test@123", 'Pretty Pretty Princesses');
const DTran = await user.getUserByEmail("dtran@stevens.edu");
const addDTran = await line.addMember(DTran.line, DTran);
console.log('dtran registered and added');

const EdmundYuen = await user.registerUser("eyuen", "Edmund", "Yuen", "eyuen@stevens.edu", "Test@123", "Test@123", 'Pretty Pretty Princesses');
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

await user.assignLittles("bbulatao", "beltemsah")
await user.assignLittles("mphu", "spayba")

const JeddAlcalde = await user.registerUser('jalcalde', 'Jedd', 'Alcalde', 'jalcalde@stevens.edu', "Test@123", "Test@123", `Pretty Pretty Princesses`);
const JAlcalde = await user.getUserByEmail("jalcalde@stevens.edu");
const addJAlcalde = await line.addMember(JAlcalde.line, JAlcalde);
console.log('jalcalde registered and added');

const KanaAbe = await user.registerUser('kabe', 'Kana', 'Abe', 'kabe@stevens.edu', 'Test@123', 'Test@123', `Pretty Pretty Princesses`);
const KAbe = await user.getUserByEmail('kabe@stevens.edu');
const addKAbe = await line.addMember(KAbe.line, KAbe)
console.log('kabe registered and added');

await user.assignLittles("rsangalang", "dtran")
await user.assignLittles("jalcalde", "kabe")

console.log('Done Seeding')
await closeConnection();