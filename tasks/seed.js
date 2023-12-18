import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import line from '../data/lines.js'
import user from '../data/users.js'
import image from '../data/images.js'

//Test Connection to Database

const db = await dbConnection();
await db.dropDatabase();

try {
    await db.collection('users').drop();
}
catch (err) {
    console.log(err)
}
try {
    await db.collection('lines').drop();
}
catch (err) {
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

const LaurenEspineli = await user.registerUser('Lauren', 'Espineli', 'lespineli@stevens.edu', 'Test@123', 'Test@123', 'Suave')
const LEspineli = await user.getUserByEmail('lespineli@stevens.edu')
const addLEspineli = await line.addMember(LEspineli.line, LEspineli);
console.log('lespineli registered and added');

const RussellSangalang = await user.registerUser("Russell", "Sangalang", "rsangalang@stevens.edu", "Test@123", "Test@123", 'Pretty Pretty Princesses');
const RSangalang = await user.getUserByEmail("rsangalang@stevens.edu");
console.log('rsangalang registered and added');
const updatePPPHead = await line.addLineHead(RSangalang, 'Pretty Pretty Princesses');
console.log('rsangalang now head of Pretty Pretty Princesses');

const DylanTran = await user.registerUser("Dylan", "Tran", "dtran@stevens.edu", "Test@123", "Test@123", 'Pretty Pretty Princesses');
const DTran = await user.getUserByEmail("dtran@stevens.edu");
const addDTran = await line.addMember(DTran.line, DTran);
console.log('dtran registered and added');

const EdmundYuen = await user.registerUser("Edmund", "Yuen", "eyuen@stevens.edu", "Test@123", "Test@123", 'Pretty Pretty Princesses');
const EYuen = await user.getUserByEmail("eyuen@stevens.edu");
const addEYuen = await line.addMember(EYuen.line, EYuen);
console.log('eyuen registered and added');

const MyaPhu = await user.registerUser("Mya", "Phu", "mphu@stevens.edu", "Test@123", "Test@123", `Mya's Infinite Line Friends`);
const MPhu = await user.getUserByEmail("mphu@stevens.edu");
console.log('mphu registered and added');
const updateMILFHead = await line.addLineHead(MPhu, `Mya's Infinite Line Friends`);
console.log(`mphu now head of Mya's Infinite Line Friends`);

const SeanPayba = await user.registerUser("Sean", "Payba", "spayba@stevens.edu", "Test@123", "Test@123", `Mya's Infinite Line Friends`);
const SPayba = await user.getUserByEmail("spayba@stevens.edu");
const addSPayba = await line.addMember(SPayba.line, SPayba);
const addSPaybas = await line.addMember(SPayba.line, SPayba);

console.log('spayba registered and added');

const BrandenBulatao = await user.registerUser('Branden', 'Bulatao', 'bbulatao@stevens.edu', "Test@123", "Test@123", `Mya's Infinite Line Friends`);
const BBulatao = await user.getUserByEmail("bbulatao@stevens.edu");
const addBBulatao = await line.addMember(BBulatao.line, BBulatao);
console.log('bbulatao registered and added');

const BelalEltemsah = await user.registerUser('Belal', 'Eltemsah', 'beltemsah@stevens.edu', 'Test@123', 'Test@123', `Mya's Infinite Line Friends`);
const BEltemsah = await user.getUserByEmail('beltemsah@stevens.edu');
const addBEltemsah = await line.addMember(BEltemsah.line, BEltemsah)
console.log('beltemsah registered and added');

await user.assignLittles("bbulatao", "beltemsah")
await user.assignLittles("mphu", "spayba")

const JeddAlcalde = await user.registerUser('Jedd', 'Alcalde', 'jalcalde@stevens.edu', "Test@123", "Test@123", `Pretty Pretty Princesses`);
const JAlcalde = await user.getUserByEmail("jalcalde@stevens.edu");
const addJAlcalde = await line.addMember(JAlcalde.line, JAlcalde);
console.log('jalcalde registered and added');

const KanaAbe = await user.registerUser('Kana', 'Abe', 'kabe@stevens.edu', 'Test@123', 'Test@123', `Pretty Pretty Princesses`);
const KAbe = await user.getUserByEmail('kabe@stevens.edu');
const addKAbe = await line.addMember(KAbe.line, KAbe)
console.log('kabe registered and added');

const IsabelSutedjo = await user.registerUser('Isabel', 'Sutedjo', 'isutedjo@stevens.edu', 'Test@123', 'Test@123', `Dankest`);
const ISutedjo = await user.getUserByEmail('isutedjo@stevens.edu');
const addISutedjo = await line.addMember(ISutedjo.line, ISutedjo)
console.log('isutedjo registered and added');

const TeddyNuevaEspana = await user.registerUser('Teddy', 'NuevaEspana', 'tnuevaespana@stevens.edu', 'Test@123', 'Test@123', `Grand`);
const TNuevaEspana = await user.getUserByEmail('tnuevaespana@stevens.edu');
const addTNuevaEspana = await line.addMember(TNuevaEspana.line, TNuevaEspana)
console.log('tnuevaespana registered and added');

await user.assignLittles("rsangalang", "dtran")
await user.assignLittles("jalcalde", "kabe")

await user.updateProfile({ firstName: "Jedd", lastName: "Alcalde", major: "Computer Science", gradYear: 2025, userBio: "help me", profilePicture: "https://i.imgur.com/52hkMDz.jpeg", links: {facebook: '', instagram: '', spotify: ''}}, "jalcalde@stevens.edu", "Test@123")
await user.updateProfile({ firstName: "Sean", lastName: "Payba", major: "Computer Science", gradYear: 2025, userBio: "oop", profilePicture: "https://i.imgur.com/52hkMDz.jpeg", links: {facebook: 'https://www.facebook.com/people/Sean-Payba/pfbid02fhsGU61FQUNMC9Etwnhs1SqSeKWpGNc325kzUbGk6HGQA21XgDACeriHRsXbMQGtl/', instagram: 'https://www.instagram.com/seanpayba/', spotify: 'https://open.spotify.com/track/6VBuuMGYskvpkK8V9zmJau'}}, "spayba@stevens.edu", "Test@123")

await image.addImage("https://i.imgur.com/E1EUKpZ.jpg", "Pretty Pretty Princesses")
console.log("Pretty Pretty Princessses Image Added")
await image.addImage("https://i.imgur.com/cisBXv1.png", "Suave")
console.log("Suave Image Added")
await image.addImage("https://i.imgur.com/43snYnY.png", "Grand")
console.log("Grand Image Added")
await image.addImage("https://i.imgur.com/3Bt5MbB.png", "Dankest")
console.log("Dankest Image Added")
await image.addImage("https://i.imgur.com/bw5t6VM.png", "Dankest")
console.log("Dankest Image Added")
await image.addImage("https://i.imgur.com/L2eaJGs.png", "Mya's Infinite Line Friends")
console.log("Mya's Infinite Line Friends Image Added")

await line.createHangout(`Mya's Infinite Line Friends`, 'First Hangout', 'A hangout at the beginning yay', {streetAddress: '1 Castle Point Terrace', city: 'Hoboken', state: 'NJ', zip: '07030'}, '1/17/2024', '5:00 PM', '9:00 PM')

console.log('Done Seeding')
await closeConnection();