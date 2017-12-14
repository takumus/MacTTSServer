const spawn = require("child_process").spawn;
const fs = require("fs");
const http = require("http");
const url = require("url")
const Puid = require("puid");
const puid = new Puid();
const config = require("./config");
function generate(voice, rate, text, out) {
    return new Promise((resolve, reject) => {
        const process = spawn("say", ["-v", voice, "-o", out, `[[rate ${rate}]]${text}`]);
        process.on('close', (code) => {
            if (code == 0) {
                resolve(code);
            }else {
                reject(code);
            }
        });
    });
}
function changePitch(from, to, pitch) {
    return new Promise((resolve, reject) => {
        const process = spawn(config.soxPath, [from, to, "pitch", pitch]);
        process.on('close', (code) => {
            if (code == 0) {
                resolve(code);
            }else {
                reject(code);
            }
        });
    })
}
function encode(from, to) {
    return new Promise((resolve, reject) => {
        const process = spawn(config.ffmpegPath, ["-i", from, to, "-y"]);
        process.on('close', (code) => {
            if (code == 0) {
                resolve(code);
            }else {
                reject(code);
            }
        });
    })
}
async function request(voice, rate, pitch, text){
    const id = puid.generate();
    // sayコマンドで生成
    const aiff = `${config.tmpDir}${id}.aiff`;
    await generate(voice, rate, text, aiff);
    if (!fs.existsSync(aiff)) throw new Error();
    // soxでピッチ変換
    const ogg = `${config.tmpDir}${id}.ogg`;
    await changePitch(aiff, ogg, pitch);
    if (!fs.existsSync(ogg)) throw new Error();
    // ffmpegでエンコード
    const out = `${config.tmpDir}${id}.${config.encodeType}`;
    await encode(ogg, out);
    if (!fs.existsSync(out)) throw new Error();
    return out;
}
http.createServer().on("request", (req, res) => {
    const query = url.parse(req.url, true).query;
    request(
        query.voice || config.defaultVoice,
        query.rate || config.defaultRate,
        query.pitch || config.defaultPitch,
        decodeURI(query.text || config.defaultText)
    ).then((out) => {
        res.writeHead(200, {'content-Type': `audio/${config.encodeType}`});
        res.write(fs.readFileSync(out, 'binary'), "binary");
        res.end(null, "binary");
    }).catch((e) => {
        res.writeHead(400, {'content-Type': 'text/plain'});
        res.end("invalid query");
    });
}).listen(config.serverPort);