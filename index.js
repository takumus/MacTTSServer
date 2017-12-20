const spawn = require("child_process").spawn;
const fs = require("fs");
const http = require("http");
const url = require("url")
const Puid = require("puid");
const puid = new Puid();
const config = require("./config");
let currentProcess = 0;
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
function changePitch(src, out, pitch) {
    return new Promise((resolve, reject) => {
        const process = spawn(config.soxPath, [src, out, "pitch", pitch]);
        process.on('close', (code) => {
            if (code == 0) {
                resolve(code);
            }else {
                reject(code);
            }
        });
    })
}
function encode(src, out) {
    return new Promise((resolve, reject) => {
        const process = spawn(config.ffmpegPath, ["-i", src, out, "-y"]);
        process.on('close', (code) => {
            if (code == 0) {
                resolve(code);
            }else {
                reject(code);
            }
        });
    })
}
function createOption(query) {
    const option = {};
    option.voice = query.voice || config.defaultVoice;
    option.rate = query.rate || config.defaultRate;
    option.pitch = query.pitch || config.defaultPitch;
    option.encoding = (query.encoding || config.defaultEncoding).toLowerCase();
    try {
        option.text = decodeURI(query.text || config.defaultText);
    }catch (e) {
        option.text = config.defaultText;
    }
    return option;
}
async function request(option){
    const id = puid.generate();
    // sayコマンドで生成
    const aiff = `${config.tmpDir}${id}.tmp.aiff`;
    await generate(option.voice, option.rate, option.text, aiff);
    if (!fs.existsSync(aiff)) throw new Error();
    // soxでピッチ変換
    const ogg = `${config.tmpDir}${id}.tmp.ogg`;
    await changePitch(aiff, ogg, option.pitch);
    if (!fs.existsSync(ogg)) throw new Error();
    // ffmpegでエンコード
    const out = `${config.tmpDir}${id}.${option.encoding}`;
    await encode(ogg, out);
    if (!fs.existsSync(out)) throw new Error();
    // tmpを削除
    fs.unlink(aiff, () => {});
    fs.unlink(ogg, () => {});
    return out;
}
function validate(option) {
    return new Promise((resolve, reject) => {
        if (isNaN(Number(option.rate))) reject("'rate' is not a number");
        if (config.minRate > option.rate || option.rate > config.maxRate) reject(`'rate' is out of range [${config.minRate} < rate < ${config.maxRate}]`);
        if (isNaN(Number(option.pitch))) reject("'pitch' is not a number");
        if (option.text.length > config.maxTextLength) reject(`'text' is longer than ${config.maxTextLength}`);
        if (config.encodings.indexOf(option.encoding) < 0) reject(`encoding '${option.encoding}' is not found in supported encoding list [${config.encodings}]`);
        resolve();
    });
}
function processCount(v) {
    currentProcess += v;
    console.log(new Date().toString(), `currentProcess: ${currentProcess} / ${config.maxProcess}`);
}
http.createServer().on("request", (req, res) => {
    if (currentProcess >= config.maxProcess) {
        console.log(new Date().toString(), `503`);
        res.writeHead(503, {'content-Type': 'text/plain'});
        res.end("service temporarily unavailable");
        return;
    }
    const option = createOption(url.parse(req.url, true).query);
    console.log(new Date().toString(), JSON.stringify(option));
    validate(option).then(() => {
        processCount(1);
        request(option).then((out) => {
            processCount(-1);
            res.writeHead(200, {'content-Type': `audio/${option.encoding}`});
            res.write(fs.readFileSync(out, 'binary'), "binary");
            res.end(null, "binary");
        }).catch((e) => {
            processCount(-1);
            res.writeHead(500, {'content-Type': 'text/plain'});
            res.end("internal error");
        });
    }).catch((error) => {
        res.writeHead(400, {'content-Type': 'text/plain'});
        res.end(`invalid query : ${error}`);
    });
}).listen(config.serverPort);