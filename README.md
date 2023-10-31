# Doc-Chatter

## About

Doc-Chatter project is a copy/fork made by following this [youtube video tutorial](https://youtu.be/ucX2zXAZ1I0). It was made by an awesome young fella [Josh tried coding](https://www.youtube.com/@joshtriedcoding). Go check him out and subscribe to his channel.

I'm doing this just to try out my new neovim setup and maybe change a thing or two to my liking while I'm at it. Maybe something useful comes out of this in the end :)

## Running the app

This application is dockerized to make it easier to maintain, run and reduce the number of external dependencies.

### Dependencies installation

Project dependencies need to be installed first.

```bash
bin/install
```

### Auth provider setup

You will need to create a [Kinde](https://kinde.com) account, which will be used for user authentication. Rename the .env.local.example to .env.local and add the required Kinde credentials.

### Running the application

Run the development server alongside a postgres database.

```bash
bin/start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Implementation details

### Environment

I deviated from Josh's single .env file definition here and stuck to the recommendations made by next.js.\
As per Next.js docs:

- files .env (all environments), .env.development, .env.production, .env.test define defaults for the environment that's currently running and should all be included in the git repository
- .env.local is the file that contains the secrets, it is applied to the currently running environment and should be included in the .gitignore file
- small gotcha: when running tests (NODE_ENV=test), .env.local is ignored, because we want every test on every machine to load the exact same variables

### Authentication

For user authentication [Kinde](https://kinde.com) is used.

#### Flow

- user clicks on sign in and gets redirected to the kinde sign in page
- after user signs in, he gets redirected back to the app dashboard page
- while loading the dashboard page, we check if the user is already added to the db
- if there is no user, we first add a new user and continue with the normal flow
- if user already exists, we just continue with the normal flow of the application

#### Improvements

- when a new user signs up, kinde triggers a webhook to our api endpoint
- api endpoint for handling webhooks saves the new user event data
- a background process detects the new user event and sends it out for handling to some message queue
- after the event is picked up and handled, a new user is added to the database and synced with the kinde users database

### Database

Prisma is used for accessing/working with the database.\
While Josh uses [PlanetScale](https://app.planetscale.com) for the database, this application is dockerized and it has a dedicated container for the database.\
You can manage the database with Adminer, just visit [http://localhost:3001](http://localhost:3001). Another option is to run prisma studio and manage the database from there.

## TODOs (learning, improvements, etc etc.)

- learn about tRPC setup - there are a couple of moving parts to this: query client, tRPC query client wrapper, app router, etc.
- learn about prisma
- dependency injection in node.js/react/next.js ecosystem (sure this can be done manually, but production ready solutions already exist for this)
