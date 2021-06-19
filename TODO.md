shortcomings of games branch pushed and PR-ed by PK on 6/19:
    game.dateTime inputs are overridden, using instead new Date() in CU and seeder
    error handling is poor or nonexistent
    front-end is very ugly
    #skill should probably be handled with a dropdown rather than an integer, for various technical reasons
    Front-end is presently hampered by its lack of inclusion of Reservation CUD.
    Lack of DRY-ness associated with the existence of TWO Route wrappers.

In C for games, insert checkBox for owner to determine whether or not he/she'll play.
Use faker for seeding addresses

put validation stuff in several columns of Users table
DRY up code associated with multiplicity of columns in Users table
change cell DataTypes from INTEGER to BIGINT
in model files check associations between tables
in model files insert a many-to-many relationship between Users and Games
remove default value for game date, and require that allowNull be false
allow any player to add a photo to a Game?
Have users login w/nickName rather than email, and NOT require that email be unique? (White space'll prob be a problem).

use React native?
generalize to handle multiple sports (ie, not just volleyball)

add address column to Users table?

Aaron: modify DrawSQL schema to reflect any changes:
    skillLevel -> skill
    nickName in Users table
    gameOwner -> ownerId
    date & time -> dateTime
    Signup table -> Reservations?
    extraInformation -> extraInfo
