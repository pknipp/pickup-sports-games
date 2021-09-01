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
1. Ensure that dateTime is always handled consistently (ie, locally?), in Home, ViewEvent, EditEvent, EditReservation, and db.
1. On Home component present columns in a more logical manner.
1. On EditReservation component, include an input field for the user to create/update his/her skill (STRONGLY recommending this if it is presently set as 0, ie "unknown").
1. Introduce a db table ("Preferences") which'll join Users with Sports.  Somewhere (Edituser?) ask the user to specify these, perhaps as a horizontal flex-layout of checkboxes. These preferences'll subsequently serve to filter the initial fetch (for events owned, reserved, and unreserved).
1. change "genders", "sizes", "positions" (and "other") from variables (arrays) to keys of "bools", largely in order to allow for the DRY-ing of code. Likewise, in Reservations and GameTypes tables, combine different bools columns into the stringification of a pojo whose values are either integers or arrays of strings, respectively.
1. Create a 4th category & 5th of booleans: "distance" & "other".  The 1st'll get used for race-type sports: running, biking, xc-skiing.  The 2nd may get used for, e.g. boat-class for sailing
1. Other sports to include: hockey, ultimate, badminton, pingpong, squash, sailing, running, bowling, golf, lacrosse, running, biking, xc skiing, archery, cricket
1. More drastic things to do if EditGame changes gameTypeId:
        - cancel reservations?
        - trigger email to players?
1. Separate contexts into auth, gender, etc.
1. Flesh out README.md
1. Continue making front-end prettier.
1. Eliminate bug ("000:000") which appears when destination = origin

stretch goals:
    implement photo capability
    code with react native
