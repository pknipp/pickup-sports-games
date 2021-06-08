remove usage of redux
improve auth error-handling (on front AND back?)
put validation stuff in several columns of Users table
DRY up code associated with multiplicity of columns in Users table
change cell DataTypes from INTEGER to BIGINT
in model files insert associations between tables
remove default value for game date, and require that allowNull be false
allow any player to add a photo to a Game?
Have users login w/nickName rather than email, and NOT require that email be unique

use React native?
generalize to handle multiple sports (ie, not just volleyball)

Aaron: modify DrawSQL schema to reflect any changes:
    skillLevel -> skill
    nickName in Users table
    gameOwner -> ownerId
    date & time -> dateTime
    Signup table -> Reservations?
    extraInformation -> extraInfo
