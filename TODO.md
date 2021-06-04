remove usage of redux
shift photo-stage from Signup to EditUser
improve auth error-handling (on front AND back?)
put validation stuff in several columns of Users table
DRY up code associated with multiplicity of columns in Users table
consolidate Account and Signup components
change cell DataTypes from INTEGER to BIGINT
in game model/migration file, change date to datetime?
in model files insert associations between tables
remove default value for game date, and require that allowNull be false

use React native?
generalize to handle multiple sports (ie, not just volleyball)

Aaron: modify DrawSQL schema to reflect any changes:
    skillLevel -> skill
    nickName in Users table
    gameOwner -> ownerId
    date & time -> dateTime
    Signup table -> ??? (Reservations, Enrollments, etc)
    extraInformation -> extraInfo
