/*
Copyright © Fog Network
Made by Nebelung
MIT license: https://opensource.org/licenses/MIT
*/

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import express from "express";
const app = express()
import basicAuth from "express-basic-auth";
const config = require("./config.json")
const port = process.env.PORT || config.port
const Corrosion = require("./lib/server")
import RhodiumProxy from 'Rhodium';
const auth = config.auth
const username = config.username
const password = config.password
const users = {}
users[username] = password
import createBareServer from '@tomphttp/bare-server-node';
import { createServer } from "node:http";

const bare = createBareServer('/bare/');

const proxy = new Corrosion({
    prefix: "/corrosion/",
    codec: "xor",
    title: "Tsunami",
    forceHttps: true,
    requestMiddleware: [
        Corrosion.middleware.blacklist([
            "accounts.google.com",
        ], "Page is blocked"),
    ]
});

proxy.bundleScripts();

const Rhodium = new RhodiumProxy({
  encode: "xor",
  prefix: "/rhodium/",
  server: app,
  Corrosion: [true, proxy],
  title: "Tsunami"
})

Rhodium.init();

if (config.chromebook == "true") {
  app.use((req, res, next) => {
    if(!req.get('User-Agent').includes(CrOS)) return res.status(403);
    next()
  });
}

if (auth == "true") { 
app.use(basicAuth({
    users,
    challenge: true,
    unauthorizedResponse: autherror
}));
}

function autherror(req) {
    return req.auth
        ? ("Credentials " + req.auth.user + ":" + req.auth.password + " rejected")
        : "Error"
}

app.use(express.static("./public", {
    extensions: ["html"]
}));

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: "./public"});
});

app.use((req, res) => {
    if (req.url.startsWith(proxy.prefix)) {
      proxy.request(req,res);
    } else if (req.url.startsWith(Rhodium.prefix)) {
      return Rhodium.request(req, res)
    } else {
      res.status(404).sendFile("404.html", {root: "./public"});
    }
});

const http = createServer();

http.on("request", (req, res) => {
  if(bare.shouldRoute(req)) bare.routeRequest(req, res); else app(req, res);
});

http.on("upgrade", (req, socket, head) => {
  if(bare.shouldRoute(req)) bare.routeUpgrade(req, socket, head); else socket.end();
});

http.listen(port, () => {
  console.log(`Tsunami is running at localhost:${port}`)
});