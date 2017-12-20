module.exports = {
    tmpDir: "./tmp/",
    serverPort: 8080,
    defaultVoice: "otoya",
    defaultRate: "200",
    defaultText: "sample",
    defaultPitch: "0",
    defaultEncoding: "ogg",
    encodings: ["ogg", "mp3", "m4a", "aiff"],
    soxPath: "./libs/sox-14.4.2/sox",
    ffmpegPath: "./libs/ffmpeg",
    maxProcess: 50,
    minRate: 100,
    maxRate: 800,
    maxTextLength: 200
}