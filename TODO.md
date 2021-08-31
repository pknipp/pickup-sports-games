shortcomings of games branch pushed and PR-ed by PK on  6/19:
    error handling is poor or nonexistent
    Lack of DRY-ness associated with the existence of TWO Route wrappers.

put validation stuff in several columns of Users table
DRY up code associated with multiplicity of columns in Users table
in model files check associations between tables
in model files insert a many-to-many relationship between Users and Games
allow any player to add a photo to a Game?
DRY up setSkills invocation in EditGame, and ensure that it'll work if gameTypes' ids aren't simply [1, 2, ..., 7]
Figure out which time to display: local or zulu.

MVP goals:
    Other sports to include:
        hockey, ultimate, badminton, pingpong, squash, sailing, running, bowling, golf, lacrosse, running, biking
    change "game" to "event", everywhere, in order to allow for the fact that some of these may be "practices"
    change "gameType" to "sport" everywhere.
    change gameType.Sport to sport.Name in db
    change "genders", "sizes", "positions" (and "other") from variables (arrays) to keys of "bools", largely in order
        to allow for the DRY-ing of code
    In Reservations and GameTypes tables, combine different bools columns into the stringification of a pojo whose
        values are either integers or arrays of strings, respectively.
    Create a 4th category of booleans: "other" or "distance".  This'll get used for race-type sports: running, biking.
    More drastic things to do if EditGame changes gameTypeId:
        - cancel reservations?
        - trigger email to players?
    Separate contexts into auth, gender, etc.
    Flesh out README.md
    Continue making front-end prettier.
    Eliminate bug ("000:000") which appears when destination = origin

stretch goals:
    implement photo capability
    code with react native
