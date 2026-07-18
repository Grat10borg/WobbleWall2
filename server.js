const fs = require("fs").promises;
const join = require("path").join;

// add promisified `fs.exists` to `fs`
fs.exists = require("util").promisify(require("fs").exists);

// setup ExpressJS app
const express = require("express");
const body_parser = require("body-parser");
const app = express();

// add JSON body parsing
app.use(body_parser.json());

// log every request
app.use((req, _, next) => {
    console.log(req.method, req.url);
    next();
})

// get the path for the quotes file
let quotes_path = join(__dirname, "quotes.txt");

// return the list of quotes as an array, fallback to `[]` on errors
let get_quotes = async () => {
    try {
        // if the quotes file doesn't exist, return empty
        if (! await fs.exists(quotes_path)) {
            return [];
        }

        // read file and split on each line
        return (await fs.readFile(quotes_path, "utf8"))
            // split on each line, and remove empty lines
            .split("\n").filter((quote) => quote);
    } catch {
        return [];
    }
}

// setup endpoint to get list of quotes
app.get("/quotes", async (_, res) => {
    return res.json(await get_quotes());
})

// setup endpoint to add a new quote, and parsing the body as plaintext
app.post("/quote", body_parser.text({type: "*/*"}), async (req, res) => {
    // get current quote and add new quote
    let quotes = await get_quotes();
    quotes.push(req.body);

    // write the new quote to file
    await fs.writeFile(quotes_path, quotes.join("\n"));

    // return the updated list of quotes back
    res.json(quotes);
})

// serve the static files
app.use("/", express.static(__dirname, {extensions: ["html"]}));

// start the server
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on port: ${port}`);
})