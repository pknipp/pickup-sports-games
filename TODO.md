shortcomings of games branch pushed and PR-ed by PK on 6/19:
    error handling is poor or nonexistent
    front-end is very ugly
    Lack of DRY-ness associated with the existence of TWO Route wrappers.

put validation stuff in several columns of Users table
DRY up code associated with multiplicity of columns in Users table
in model files check associations between tables
in model files insert a many-to-many relationship between Users and Games
allow any player to add a photo to a Game?
Have users login w/nickName rather than email, and NOT require that email be unique? (White space'll prob be a problem).

Aaron: modify DrawSQL schema to reflect any changes:
    skillLevel -> skill
    nickName in Users table
    gameOwner -> ownerId
    date & time -> dateTime
    Signup table -> Reservations?
    extraInformation -> extraInfo

MVP goals:
    Continue making front-end prettier.
    Add extraInfo column to Reservations table and use Tooltip to render this on GameView

stretch goals:
    implement photo capability
    code with react native
    generalize to handle multiple sports (ie, not just volleyball)
