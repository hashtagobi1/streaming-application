const express = require('express');
const fs = require('fs');
// const path = require('path');
const cors = require('cors');
const { ppid } = require('process');
const thumbsupply = require('thumbsupply')
const app = express();
const ffprobe = require('ffprobe')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

// const probe = require('node-ffprobe')
// const ffprobeInstaller = require('@ffprobe-installer/ffprobe')

// console.log(ffprobeInstaller.path, ffprobeInstaller.version)

// ffprobe.FFPROBE_PATH = ffprobeInstaller.path

// let track = '/assets'



const videos = [
  {
    id: 0,
    poster: '/video/0/poster',
    duration: '30secs',
    name: 'Home Video'
  },
  {
    id: 1,
    poster: '/video/1/poster',
    duration: '5secs',
    name: 'Not WALL-E'
  },
  {
    id: 2,
    poster: '/video/2/poster',
    duration: '27secs',
    name: 'The Glowing Star'
  },
]


app.use(cors());

//end points to fetch videos meta data

app.get('/videos', (req, res) =>
  res.json(videos));

app.get('/video/:id/poster', (req, res) => {
  thumbsupply.generateThumbnail(`assets/${req.params.id}.mp4`)
    .then(thumb => res.sendFile(thumb));
});

app.get('/video/:id/caption', (req, res) => res.sendFile('assets/captions/sample.vtt', { root: __dirname }));


app.get('/video/:id/data', (req, res) => {
  const id = parseInt(req.params.id, 10);
  res.json(videos[id]);
});

app.get('/video/:id', function (req, res) {
  const path = `assets/${req.params.id}.mp4`;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    console.log('we have range', range);
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1
    console.log(parts)
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    console.log('no range', range);
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

app.listen(4000, function () {
  console.log('Listening on port 4000! 🚀')
});