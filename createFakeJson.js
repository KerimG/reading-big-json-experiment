const fs = require("fs");
const { faker } = require("@faker-js/faker");

const createFakeJson = async (fileName, size) => {
  const writeStream = fs.createWriteStream(fileName, { highWaterMark: 16 * 1024 });

  writeStream.write("[\n");

  for (let i = 0; i < size; i++) {
    const data = {
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      city: faker.location.city(),
      country: faker.location.country(),
      bio: faker.person.bio(),
      avat: faker.image.url(),
      date: faker.date.recent(),
      ip: faker.internet.ip(),
      mac: faker.internet.mac(),
      url: faker.internet.url()
    };

    if (i % 100000 === 0) {
      console.log(`Record ${i} created`);
    }

    if (!writeStream.write(JSON.stringify(data))) {
      await new Promise((resolve) => writeStream.once("drain", resolve));
    }

    if (i < size - 1) {
      writeStream.write(",\n");
    }
  }

  writeStream.write("\n]");
  writeStream.end();

  console.log(`File ${fileName} created with ${size} records`);
};
createFakeJson("./large-file2.json", 10000000);
