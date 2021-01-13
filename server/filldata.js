// server > filldata.js
const faker = require("faker");

const database = {
  employees: [],
};

for (let i = 1; i <= 150; i++) {
  database.employees.push({
    id: i,
    name: faker.name.findName(),
    jobtype: faker.name.jobTitle(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    imageUrl: faker.image.avatar(),
  });
}

console.log(JSON.stringify(database));
