/**
 * This is a Mongo Shell script. Run it with Mongo shell on command line:
 *     mongo mongodb-test.js
 * or inside Mongo shell: load('mongodb-test.js')
 */
db = connect('localhost/techit2');

print('Connected to database: techit2');

// drop the collections if they already exist

db.tickets.drop();
db.units.drop();
db.users.drop();

// create users (all hash are bcrypt('abcd'))

admin = {
  username: 'techit',
  hash: '$2a$10$v2/oF1tdBlXxejoMszKW3eNp/j6x8CxSBURUnVj006PYjYq3isJjO',
  roles: ['ADMIN'],
  enabled: true,
  firstName: 'System',
  lastName: 'Admin',
  email: 'techit@localhost.localdomain',
  phone: '323-343-1234'
};

supervisor1 = {
  username: 'jsmith1',
  hash: '$2a$10$9PJIPq9PMYHd9L8kb66/Nuu7DDQqq29eOsVF1F8SnPZ2UfD6KC/ly',
  roles: ['SUPERVISOR'],
  enabled: true,
  firstName: 'John',
  lastName: 'Smith',
  email: 'jsmith1@localhost.localdomain',
  phone: '323-343-2345',
  unit: 1
};

supervisor2 = {
  username: 'jsmith2',
  hash: '$2a$10$9PJIPq9PMYHd9L8kb66/Nuu7DDQqq29eOsVF1F8SnPZ2UfD6KC/ly',
  roles: ['SUPERVISOR', 'TECHNICIAN'],
  enabled: true,
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jsmith2@localhost.localdomain',
  phone: '323-343-3456',
  unit: 2
};

tech1 = {
  username: 'jjim',
  hash: '$2a$10$Q8G5BtMC.C5oonZzvBS.0usxJ2fpccf.I46pw3IGi.zorntvTSYbK',
  roles: ['TECHNICIAN'],
  enabled: true,
  firstName: 'Jimmy',
  lastName: 'Jim',
  email: 'jjim@localhost.localdomain',
  phone: '323-343-4567',
  unit: 1
};

tech2 = {
  username: 'blee',
  hash: '$2a$10$d8lhouzPhxZ.nLCaqjh5gevTyA3tZDUMwuy2WAsWAm.i/ag/btcxe',
  roles: ['TECHNICIAN'],
  enabled: true,
  firstName: 'Bob',
  lastName: 'Lee',
  email: 'blee@localhost.localdomain',
  phone: '323-343-5678',
  unit: 1
};

user = {
  username: 'jojo',
  hash: '$2a$10$Qn0U5T00Fkutb7UyBE9yg.aOBp2Z9OqN4SAWCSkdm4mrZmYIuYpq.',
  roles: [],
  enabled: true,
  firstName: 'Joseph',
  lastName: 'Joestar',
  email: 'jojo@localhost.localdomain',
  phone: '323-343-6789'
};

admin.id = db.users.insertOne(admin).insertedId;
supervisor1.id = db.users.insertOne(supervisor1).insertedId;
supervisor2.id = db.users.insertOne(supervisor2).insertedId;
tech1.id = db.users.insertOne(tech1).insertedId;
tech2.id = db.users.insertOne(tech2).insertedId;
user.id = db.users.insertOne(user).insertedId;

// create units

unit1 = {
  _id: 1,
  name: 'TechOps',
  supervisors: [supervisor1.id],
  technicians: [tech1.id, tech2.id]
};

unit2 = {
  _id: 2,
  name: 'ITC',
  supervisors: [supervisor2.id],
  technicians: [supervisor2.id]
};

db.units.insertMany([unit1, unit2]);

// create tickets

ticket1 = {
  createdBy: user.id,
  createdForName: user.firstName + ' ' + user.lastName,
  createdForEmail: user.email,
  subject: 'Projector Malfunction',
  details: 'The projector and some other equipment are broken in room A220.',
  unit: 2,
  dateCreated: Date.now,
  priority: 'MEDIUM',
  status: 'OPEN',
  technicians: [],
  updates: []
};

ticket2 = {
  createdBy: user.id,
  createdForName: user.firstName + ' ' + user.lastName,
  createdForEmail: user.email,
  subject: 'Senior Design 2018 Equipment Request',
  details: 'One of the EE senior design projects needs some equipment.',
  unit: 1,
  dateCreated: Date.now,
  dateAssigned: Date.now,
  priority: 'MEDIUM',
  status: 'ASSIGNED',
  technicians: [tech1.id, tech2.id],
  updates: []
};

ticket3 = {
  createdBy: user.id,
  createdForName: user.firstName + ' ' + user.lastName,
  createdForEmail: user.email,
  subject: 'ME Lab Improvements',
  details: 'Update testing equipment in the ME lab.',
  unit: 1,
  dateCreated: Date.now,
  dateAssigned: Date.now,
  priority: 'MEDIUM',
  status: 'ASSIGNED',
  technicians: [tech1.id],
  updates: []
};

db.tickets.insertMany([ticket1, ticket2, ticket3]);

db.tickets.createIndex({
  subject: "text",
  details: "text"
});
