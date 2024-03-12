const {
  client,
  createTables,
  createUser,
  createPlace,
  fetchUsers,
  fetchPlaces,
  fetchVacations,
  createVacation,
  destroyVacation,
} = require('./db');

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:userId/vacations/:id', async (req, res, next) => {
  try {
    await destroyVacation({ id: req.params.id, user_id: req.params.userId });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/users/:id/vacations', async (req, res, next) => {
  try {
    console.log(req.body);
    res
      .status(201)
      .send(
        await createVacation({
          user_id: req.params.id,
          place_id: req.body.place_id,
          travel_date: req.body.travel_date,
        })
      );
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/places', async (req, res, next) => {
  try {
    res.send(await fetchPlaces());
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/vacations', async (req, res, next) => {
  try {
    res.send(await fetchVacations());
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message || err });
});

const init = async () => {
  console.log('connecting to database');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [moe, lucy, ethyl, berlin, barcelona, seoul, london] =
    await Promise.all([
      createUser({ name: 'moe' }),
      createUser({ name: 'lucy' }),
      createUser({ name: 'ethyl' }),
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
    console.log('TEST OUT APP WITH curl:');
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/places`);
    console.log(`curl localhost:${port}/api/vacations`);
    console.log(
      `curl -X DELETE localhost:${port}/api/users/${moe.id}/vacations/${vacations[1].id}`
    );
    console.log(
      `curl -X POST localhost:${port}/api/users/${ethyl.id}/vacations -d '{"travel_date": "04/01/2025", "place_id": "${seoul.id}"}' -H "Content-Type:application/json"`
    );
  });
};

init();
