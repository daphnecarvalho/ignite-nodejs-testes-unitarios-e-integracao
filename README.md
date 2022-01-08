# Challenge: Unit and Integration Testing

Instructions: [Testes unitários](https://www.notion.so/Desafio-01-Testes-unit-rios-0321db2af07e4b48a85a1e4e360fcd11) and [Testes de integração](https://www.notion.so/Desafio-02-Testes-de-integra-o-70a8af48044d444cb1d2c1fa00056958).

## Base URL
http://localhost:3333
## Tests
Test Suites: 12 total

Tests: 36 total

## Project commands
### Prepare project  
```bash
  # Install dependencies
  yarn install

  # Docker - Create containers
  docker-compose up

  # Run migrations
  yarn typeorm migration:run 
```

### Run project
```bash
  # Docker - Start containers
  docker-compose start

  # Docker - Stop containers
  docker-compose stop
```

### Prepare project for test
```postgres
  -- Beekeeper: execute query
  create database fin_api_test
```

### Run test
```bash
  # Run tests
  yarn test
```