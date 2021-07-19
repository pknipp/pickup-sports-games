shortcomings of games branch pushed and PR-ed by PK on 6/19:
    game.dateTime inputs are overridden by random future dates (Don't fix until using RN?)
    error handling is poor or nonexistent
    front-end is very ugly
    #skill should probably be handled with a dropdown rather than an integer, for various technical reasons
    Lack of DRY-ness associated with the existence of TWO Route wrappers.

put validation stuff in several columns of Users table
DRY up code associated with multiplicity of columns in Users table
in model files check associations between tables
in model files insert a many-to-many relationship between Users and Games
allow any player to add a photo to a Game?
Have users login w/nickName rather than email, and NOT require that email be unique? (White space'll prob be a problem).

use React native?
generalize to handle multiple sports (ie, not just volleyball)

Aaron: modify DrawSQL schema to reflect any changes:
    skillLevel -> skill
    nickName in Users table
    gameOwner -> ownerId
    date & time -> dateTime
    Signup table -> Reservations?
    extraInformation -> extraInfo
