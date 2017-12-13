const spawn = require("child_process").spawn;
const fs = require("fs");
const http = require("http");
const url = require("url")
const Puid = require("puid");
const puid = new Puid();
const config = {
    tmpDir: "./tmp/",
    serverPort: 8080,
    defaultVoice: "otoya",
    defaultRate: "200",
    defaultText: "sample"
}
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
    })
}
async function request(voice, rate, text){
    const id = puid.generate();
    const out = `${config.tmpDir}${id}.aiff`;
    await generate(voice, rate, text, out);
    if (!fs.existsSync(out)) throw new Error();
    return out;
}
http.createServer().on("request", (req, res) => {
    const query = url.parse(req.url, true).query;
    request(
        query.voice || config.defaultVoice,
        query.rate || config.defaultRate,
        decodeURI(query.text || config.defaultText)
    ).then((out) => {
        res.writeHead(200, {'content-Type': 'audio/aiff'});
        res.write(fs.readFileSync(out, 'binary'), "binary");
        res.end(null, "binary");
    }).catch((e) => {
        res.writeHead(400, {'content-Type': 'text/plain'});
        res.end("invalid query");
    });
}).listen(config.serverPort);