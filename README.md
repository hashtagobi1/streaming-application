# Deploying Application

## Steps

run  `git clone https://github.com/hashtagobi1/streaming-application.git`

Then enter the server directory to start up the local server:

    cd server
    npm run dev

Then launch up client with

    cd client
    npm run start
   That's it! enjoy the streaming application 🚀 

# Info

- Backend
	- Video is pulled from /assets/ folder and chunks of data are sent as client makes continuous requests until all chunks have been fetched
	- Thumbnails dynamically generated using thumbSupply + FFMpeg
	- fixed captions are generated for all videos thru a VTT file provided
	- React App fetches video via ID and a video is returned that matches said ID
- Front End
	- Router used to the routing between the Home page and the video section
	- When Component is rendered, a fetch request is made to local server which returns video metadata that includes data needed to render correct information about video

## Technologies used
- React + Node
- Router
- Bootstrap
- Styled Components