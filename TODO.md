shortcomings of games branch pushed and PR-ed by PK on  6/19:
    error handling is poor or nonexistent
    Lack of DRY-ness associated with the existence of TWO Route wrappers.

put validation stuff in several columns of Users table
DRY up code associated with multiplicity of columns in Users table
in model files check associations between tables
in model files insert a many-to-many relationship between Users and Games
allow any player to add a photo to a Game?
Have users login w/nickName rather than email, and NOT require that email be unique? (White space'll prob be a problem).
DRY up setSkills invocation in EditGame, and ensure that it'll work if gameTypes' ids aren't simply [1, 2, ..., 7]
Figure out which time to display: local or zulu.

MVP goals:
    What to do if EditGame changes things (like Sport):
        - cancel reservations?
        - trigger email to players?
    Separate contexts into auth, gender, etc.
    Other sports to include:
        hockey, ultimate, badminton, pingpong, squash, sailing, running, bowling, golf, lacrosse
    Flesh out README.md
    Continue making front-end prettier.
    Eliminate bug ("000:000") which appears when destination = origin
    Use Tooltip to render reservations/extraInfo on GameView

stretch goals:
    implement photo capability
    code with react native
