
shortcomings of games branch pushed and PR-ed by PK on  6/19:
    error handling is poor or nonexistent
    Lack of DRY-ness associated with the existence of TWO Route wrappers.

put validation stuff in several columns of Users table
in model files check associations between tables
allow any player to add a photo to a Game?
DRY up setSkills invocation in EditGame, and ensure that it'll work if gameTypes' ids aren't simply [1, 2, ..., 7]
Figure out which time to display: local or zulu.

MVP goals:
1. Do filtering (as controlled by 3 radio buttons) on back - as queries - rather than on front.
1. Create db.Sessions in order to allow one user to have multiple sessions (as I've done w/node starter).
1. On Homepage enable user to sort on "Player reservations" column.
1. Filter api/events GET all route with by requiring the eventDates to be in the future.
1. Insert something into api/events that will query the database for all events in the future.  If the number of events is less than 80 (or some other number), loop over the Favorites table, and - given the number (nNeeded) of additional events needed and the number of rows (nFavorites) in the Favorites table, create new events using the probability nNeeded / nFavorites.  Use faker.date.between to keep Event.dateTime between present and - perhaps - 2 months in the future.  Do something similar with Reservations, but somehow prevent those reservations all from having the exact same createdAt/updatedAt dates.  (Perhaps do this first by randomly deleting reservations, and then adding enough to keep the number of future reservations approximately equal to a certain threshold)
1. Ensure that event.time changes when viewed by those in other time zones, and get event.dateTime to work properly on heroku.
1. Figure out how to reduce the number of fetches, or use joins rather than two or more queries? SOLUTION: from Home component transfer out the useEffect with the events fetch, and put it into the loadUser function which is useEffect-ed in App.  These data can then be transferred to the Home component either by context or (possibly?) by props threading.
1. When attempting to delete a row in a table of the db, render a warning if rows in other tables are dependent upon this row.  Such dependency-chains include user/reservation, user/(favorite)/event/reservation, favorite/event/reservation, event/reservation (done).
1. Other sports to include: golf, archery, cricket, pickle, swimming, wrestling
1. More drastic things to do if EditEvent changes gameTypeId:
        - cancel reservations?
        - trigger email to players?
1. Create a 4th column in table appearing in Favorites component, to include any sports-specific links.
1. DRY index.css
1. Insert isCommissioner column in Favorites table (as discussed in README), thereby allowing full CRUD for the Sports table.

stretch goals:
    implement photo capability
    code with react native
