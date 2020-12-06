# MossBot

A multifunctional discord bot that includes commands regarding stock market, League of Legends, Daily Checkins, and more to come!

This bot was created for personal use and is designed for specific single server. Some modifications are required for adding this bot to your personal servers, come customizations could also be made. Refer to the bottom of README for more information.


## List of Commands

- Prefix: `!`

### Stocks

 - `stock` - Show the information of a stock with inputted symbol (i.e. l!stonk AMD).
 - `stockadd` - Add a stock to your watchlist (i.e. !stockadd AMD).
 - `stockdel` - Delete a stock to your watchlist (i.e. !stockdel AMD).
 - `watchlist` - Display your personal stock watchlist.

### League of Legends

 - `mastery` - Show the champion masteries in descending order for a specific player (i.e. l!mastery TL Tactical).
 - `match` - Show the current match of a player and display the information if the inputted player is in a match (i.e. l!match C9 Zven).
 - `ranked` - Show the ranked information of a player (i.e. l!ranked TL Tactical).
 - `rotation` - Show the current free champion rotation available for players level 10 and above (i.e. l!rotation).

 ### Checkin

 - `checkin` - Allow the user to check in once daily from 8:00 am to 10:00 am.
 - `ranking` - Display the check in ranking of the server.
 - `morning` - Sends a good morning message everyday at 8:00 am.

 ## Adding the Bot to Your Server

### Required .env setup

 - `TOKEN` - The token of your discord bot, found on discord developer portal
 - `profilepic` - The link to your bot's profile picture
 - `iex` - The token of your iex token for stocks functions
 - `mongo`  - The database of your checkin database on MongoDB
 - `mongostock` - The database of the stock watchlists database on MongoDB
 - `morning` - The server channel ID of where the morning messages are being sent to

 ### Customizations

 - `Check in time availability` - Modify the time range in checkin.js for cutomization of check in time
 - `Morning messages` - Modify the message at the end of index.js for customization of morning message
 - `Morning messages time` - Modify the time the bot posts morning messageand refresh rate at the end of index.js

## License & Legal

Copyright © 2020 LunaBot