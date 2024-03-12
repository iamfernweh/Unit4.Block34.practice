const { client, createTables, createUser } = require('./db');

const init = async () => {
  console.log('connecting to db');
  await client.connect();
  console.log('connected to db');
  await createTables();
  console.log('tables created');
  const [moe, lucy] = await Promise.all([
    createUser({ name: 'moe' }),
    createUser({ name: 'lucy' }),
  ]);
  console.log(moe.id, lucy.id);
};

init();
