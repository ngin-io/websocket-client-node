var crypto = require('crypto');

const baseUrl = 'https://socket.btcmarkets.net';
const path = '/v2';
const channels = ['tick', 'heartbeat'];
const marketIds = ['BTC-AUD', 'LTC-AUD'];
// if using private channels then set api key and secret for authentication
const key = undefined;
const secret = '';


var socket = require('socket.io-client')(baseUrl, {
    secure: true,
    transports: ['websocket'],
    upgrade: false,
    path: path
});


var request = {
    marketIds:marketIds,
    channels: channels
}

if (key) {
    const now = Date.now();
    const strToSign =  "/users/self/subscribe" + "\n" + now;
    const signature = signMessage(secret, strToSign);
    request.timestamp = now;
    request.key = key;
    request.signature = signature;
}

socket.on('connect', function(){
    socket.emit('subscribe', request);
});

socket.on('error', function(err){
    console.log(err);
});

socket.on('message', function(data){
    console.log(data);
});

socket.on('disconnect', function(){
    console.log('disconnected');
});


function signMessage(secret, message) {
    var key = Buffer(secret, 'base64');
    var hmac = crypto.createHmac('sha512', key);
    var signature = hmac.update(message).digest('base64');
    return signature;
}
