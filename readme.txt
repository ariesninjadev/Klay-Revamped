This chat application, as of 09/07/23, is only intented for 2 person use. Therefore, until version 1.6 is released, New enviroments need to be created for each chat, and each needs to be configured manually.

CURRENT VERSION: 1.4 (Private) BETA

To create a new chat instance prior to 1.6, please carefully follow these steps:

1. Modify the collection name in the mon.js file. It should be the first line. Not changing this will simply store messages to whatever chat was cloned.
2. Update the "user1" and "user2" variables in the server.js file. These values are transfered in a login handshake to every client connected.

This chat is not intended for large-scale use. Please rework backend before upscaling.