# stock-ticker

## Prerequisites
 For local development:
 * Node 18
 * Docker

 For deployment:
 * Docker Desktop or Docker Compose CLI
 * AWS account with running redis cluster
 * Check this article for permissions https://docs.docker.com/cloud/ecs-integration/

 ## Starting dev environment

 * Start a local instance of redis
 * Create a .env file in the root and add redis host address and port number. See example.
 * Run `cd scripts && npm run seed-redis` to seed the database with some data
 * Start the backend server `cd server && npm start`
 * Start the frontend `cd client && npm start`

  ## Limitations
 
 * Local docker-compose uses hosted version of API
 * Improve test coverage
 * Separate nginx configs for dev and prod
