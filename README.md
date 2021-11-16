# Leroy Merlin Challenge

Steps to complete the challenge:

- [x] Create api-gateway (RESTful API) to handle all requests;
- [x] Create a consumer (Microservice) to handle the sheets;
- [x] Create docker-compose.yml for MongoDB and RabbitMQ;
- [x] Connect consumer and api-gateway to RabbitMQ and MongoDB;
- [x] Treat excel and write on database on the consumer;
- [ ] Create tests to ensure last step will work as it should;
- [x] Create endpoint to verify if the excel file was processed (using database?);
- [x] Create tests to ensure last step will work as it should;
- [x] Create READ, UPDATE, DELETE operations on api-gateway;
- [x] Create tests to ensure last step will work as it should;
- [x] Validate file format;
- [x] Create a documentation to describe the project and how to launch it;
- [ ] Create code documentation;
- [ ] Upload api-gateway to Heroku connected to a database (without the RabbitMQ connection);

## Project requirements

- docker;
- docker-compose;
- npm or yarn;

## Instalation

Enter inside both the projects (api-gateway and queue-files) and execute the following command:

---

```
npm install
```

or

```
yarn
```

## Running the app (Use the same commands for both applications)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

or

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## Testing

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

or

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Instructions

You can be importing the file `Insomnia_2021-11-16` located in the root directory to your Insomnia to use as an example for testing the application endpoints.
