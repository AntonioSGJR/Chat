const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    CLIENT_URL
} = process.env

assert(PORT, "PORT is required");
assert(HOST, "HOST is required");
assert(CLIENT_URL, "CLIENT_URL is required");

module.exports = {
    port: PORT,
    host: HOST,
    hostUrl: HOST_URL,
    clientURL: CLIENT_URL
}