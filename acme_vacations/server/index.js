const {
  client,
  createTables,
  createUser,
  createPlace,
  fetchUsers,
  fetchPlaces,
  createVacation,
  fetchVacations,
} = require('./db');

const init = async () => {
  console.log('connecting to db');
  await client.connect();
  console.log('connected to db');
  await createTables();
  console.log('tables created');
  const [moe, lucy, larry, berlin, barcelona, seoul, london] =
    await Promise.all([
      createUser({ name: 'moe' }),
      createUser({ name: 'lucy' }),
      createUser({ name: 'larry' }),
      createPlace({ name: 'berlin' }),
      createPlace({ name: 'barcelona' }),
      createPlace({ name: 'seoul' }),
      createPlace({ name: 'london' }),
    ]);
  console.log(await fetchUsers());
  console.log(await fetchPlaces());

  const vacations = await Promise.all([
    createVacation({
      user_id: moe.id,
      place_id: london.id,
      travel_date: '03/19/2024',
    }),
    createVacation({
      user_id: moe.id,
      place_id: berlin.id,
      travel_date: '04/01/2024',
    }),
    createVacation({
      user_id: lucy.id,
      place_id: barcelona.id,
      travel_date: '04/01/2024',
    }),
  ]);
  console.log(await fetchVacations());
};

init();
