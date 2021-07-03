# Volleyball Meetup

## Database
- https://drawsql.app/getout/diagrams/volleyballmeetup

## API set up


1. Router: 'users', urlPrefix "api/users"
    - GET - get all user info
    - POST - create new user
    - PUT - edit user info
    - DELETE - delete user
2. Router: 'games', urlPrefix "api/games"
    - GET / - get all games (count for each game)
    - GET /:id - get single game (actual list of names)
    - POST / - create a game
    - PUT /:id - change game info
    - DELETE /:id - delete a game
3. Router: 'signUps', urlPrefix "api/signUps"
    - GET /:gameId - get all users of game
    - POST /:gameId - sign a user up for a game
    - PUT /:id (might have to use combo of userId and gameId) - edit users sign up
    - DELETE /:id (might have to use combo of userId and gameId) - delete sign up
