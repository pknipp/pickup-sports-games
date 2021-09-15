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
1. When attempting to delete a row in a table, render a warning if rows in other tables are dependent upon this row.  Such dependency-chains include user/reservation, user/(favorite)/event/reservation, favorite/event/reservation, event/reservation
1. Figure out why Line 105 of ViewEvent yields an error when attempting to access ViewEvent after editing a reservation.
1. Reconfigure Favorites component using Bootstraptable.
1. Look for other discrete (MC or checkbox) inputs, and use fetches rather than setting state.
1. Ensure that event.time changes when viewed by those in other time zones.
1. Get event.dateTime to work properly on heroku.
1. Other sports to include: hockey, badminton, pingpong, squash, bowling, golf, lacrosse, archery, cricket, rugby
1. More drastic things to do if EditGame changes gameTypeId:
        - cancel reservations?
        - trigger email to players?
1. Separate contexts into auth, gender, etc.
1. Flesh out README.md
1. Continue making front-end prettier.
1. Eliminate bug ("000:000") which appears when destination = origin (or when travel time is an integer number of hours)

stretch goals:
    implement photo capability
    code with react native
