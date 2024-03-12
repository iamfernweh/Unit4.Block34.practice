const {
  client,
  createTables,
  createUser,
  createPlace,
  createVacation,
  fetchUsers,
  fetchPlaces,
  fetchVacations,
  destroyVacation,
} = require('./db');

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (er) {
    next(er);
  }
});

app.get('/api/places', async (req, res, next) => {
  try {
    res.send(await fetchPlaces());
  } catch (er) {
    next(er);
  }
});

app.get('/api/vacations', async (req, res, next) => {
  try {
    res.send(await fetchVacations());
  } catch (er) {
    next(er);
  }
});

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

  await destroyVacation(vacations[0]);
  console.log(await fetchVacations());

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/places`);
    console.log(`curl localhost:${port}/api/vacations`);
  });
};

init();
