# Doc-Chatter

## About

Doc-Chatter project is a copy/fork made by following this [youtube video tutorial](https://youtu.be/ucX2zXAZ1I0). It was made by an awesome young fella [Josh tried coding](https://www.youtube.com/@joshtriedcoding). Go check him out and subscribe to his channel.

I'm doing this just to try out my new neovim setup and maybe change a thing or two to my liking while I'm at it. Maybe something useful comes out of this in the end :)

## Running the app

First install all the dependencies.

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the development server by executing one of the following commands.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## App details

### Authentication

For authenticating users [kinde](https://kinde.com) is used.

#### Authentication flow

- user clicks on sign in and gets redirected to the kinde sign in page
- after user signs in, he gets redirected back to the app dashboard page
- while loading the dashboard page, we check if the user is already added to the db
- if there is no user, we first add a new user and continue with the normal flow
- if user already exists, we just continue with the normal flow of the application

##### Authentication flow improvement

- when a new user signs up, kinde triggers a webhook to our api endpoint
- api endpoint for handling webhooks saves the data about the new user event
- a background process detects the new user event and sends it out for handling
- after the event is handled, a new user is added to the database and synced with the kinde users database

#### "Hard things"

- learn about tRPC setup - there are a couple of moving parts to this: query client, tRPC query client wrapper, app router, etc.
