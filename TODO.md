shortcomings of games branch pushed and PR-ed by PK on  6/19:
    error handling is poor or nonexistent
    Lack of DRY-ness associated with the existence of TWO Route wrappers.

put validation stuff in several columns of Users table
DRY up code associated with multiplicity of columns in Users table
in model files check associations between tables
in model files insert a many-to-many relationship between Users and Games
allow any player to add a photo to a Game?
Have users login w/nickName rather than email, and NOT require that email be unique? (White space'll prob be a problem).

MVP goals:
    Modify EditGame to allow for the facts that ...:
        gameType is a "thing"
    What to do if EditGame changes things (like Sport):
        - cancel reservations?
        - trigger email to players?
    Partition booleans into three categories: gender, number, and position
        genderBooleans:
            defined - and put into context - in App component (ie, not in db)
            value = ["men's", "women's", "mixed", "gender-neutral"]
            heading will include parenthetical "trans-inclusive"
        sizeBooleans: defined in db.gameTypes, allow to be null (e.g., soccer and softball)
        positionBooleans: defined in db.gameTypes, allow to be null (e.g., tennis and basketball)
    On EditReservation page, issue warning if user fails to submit at least one "true" for each of the three boolean categories which are non-empty: gender, positions, sizes
    Separate contexts into auth, gender, etc.
    Other sports to include:
        hockey, ultimate, badminton, pingpong, squash, sailing, running, bowling, golf, lacrosse
    Flesh out README.md
    Continue making front-end prettier.
    Eliminate bug ("000:000") which appears when destination = origin
    Add extraInfo column to Reservations table and use Tooltip to render this on GameView

stretch goals:
    implement photo capability
    code with react native
