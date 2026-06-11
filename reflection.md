# what advice would you give to yourself if you were to start a project like this again?
- Especially with such a big project, we would have benefitted from organizing our code, folders, images and all other assets as we go rather than struggling at the end to rememeber where stuff is. We also would tell our previous selves to focus on single things at a time, for most of this project we were jumping around where we were working which would lead to lots of bugs that interfere with other parts of the project and just slow down our work pace. 
- Rather than trying to frankenstien our games (mainly roulette and blackjack) into remade versions that use advance features like p5 party and fancy betting, Resart those projects with the knowledge you have from the first iteration. We ended up doing that in the end but lots of time was wasted trying to put new features into flawed code

# did you complete everything in your “needs to have” list?
- Yes we almost completed everything in our needs to have 
- We have our 6 quality casino style games that were all playable from one website
- Our website had a clean design that we were proud of
- The only mishap being that our gameplay may not be entirely bug free, especially with window resizing and party.js stuff, but for the most part all easily diagnosed were fixed
- We made a working physics based plinko with matter.js 
- We had sound effects for all games to improve expereince for user
- All games had instructions to follow

# What was the hardest part of the project?
Jon:
- The hardest part was figuring out the matter.js syntax and how to use it especially in combination with the Ball class
- Figuring out scaling for the plinko grid so that the multiplier boxes follow the grid and keep the money system balanced

Tj:
- Certianly the hardest part was tackling p5 party with its limited documentation. However once the basic features were implimented the other parts came together well. 
- debugging multiplayer games, I could think of about 1000 reason that some code wouldnt work due to network or connectivity issues, Going through all the possibilities and thuroughly testing them proved to be a challenge
- Id have to use new servers every time because p5 party saves information to the server name so some information was having issues during debuging, not exactly hard to deal with but was difficult to find out that was one of my issues


# Were there any problems you could not solve?
Jon:
- Plinko with window resizing was a nightmare and I was struggling to figure out how to make sure that if the window is resized while any balls are in play to put the balls back in the proper spot, but for now if you resize the window with the balls in play they can fly out only hit the biggest bet.

Tj:
- Currently Blackjack does not handle players disconnecting very well. If players leave the game it has to be refreshed then players must reselect their seats. This is because as far as i could tell there is not a player disconect function, I attempted to solve it with connection timers and idle disconnects but it became a nightmare to debug and make work properly, In the end that system made the game feel worse than without it so it was scrapped. I imagine i could use a function to determine when a host change happens but it would be very complicated and im happy with the state it is in.