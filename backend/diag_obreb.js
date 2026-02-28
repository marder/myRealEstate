require("dotenv").config();
const https = require("https");

const testCases = ["Czajków", "Dąbrowica", "Czyste", "Stefanów", "Szymany"];

async function checkObreb(name) {
    return new Promise((resolve) => {
        const url = `https://uldk.gugik.gov.pl/?request=GetRegionById&id=${encodeURIComponent(name)}&result=region,commune,county`;
        https.get(url, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve(data));
        }).on("error", () => resolve("ERROR"));
    });
}

async function runTest() {
    for (const name of testCases) {
        const res = await checkObreb(name);
        console.log(`Test dla: ${name}`);
        console.log(res);
        console.log("-------------------");
    }
    process.exit();
}

runTest();
