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
Include a "misc" column to the Reservations table.  This would require an additional input element on the EditReservation component, along with a method (tooltip?) for allowing the gameOwner to read the note.

Aaron: modify DrawSQL schema to reflect any changes:
    skillLevel -> skill
    nickName in Users table
    gameOwner -> ownerId
    date & time -> dateTime
    Signup table -> Reservations?
    extraInformation -> extraInfo

MVP goals:
    Comment out all references to "photo".
    Make front-end a bit prettier.

stretch goals:
    implement photo capability
    code with react native
    generalize to handle multiple sports (ie, not just volleyball)
