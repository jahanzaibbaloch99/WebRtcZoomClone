# simple-peer-legacy

This repository is an indirect fork of the original feross/simple-peer. The only purpose of creating this library is to make simple-peer compatible with react-native-webrtc. The default simple-peer also works with react-native-webrtc but only for datachannels, as soon as you add a stream it crashes because simple-peer uses addTrack which is the newer API, meanwhile react-native-webrtc still only supports addStream and onaddstream.

This library should be useless after react-native-webrtc adds support for addTrack and the like.

#### Note for react-native-webrtc users.

If you already had simple-peer installed and are going to use this one, then after installing remember to clean packager cache by restarting your metro bundler with ```react-native start --reset-cache```, else you might just like me be getting a can't find 'addTrack' error.

#### Deviations from simple-peer

addTrack, removeTrack, replaceTrack, and addTransceiver have been removed. addStream and removeStream can still be used.

## install

```
npm install git+https://github.com/ExpandoPakistan/simple-peer-legacy.git
```

## usage

You can have a look at index.html inside simple-peer-legacy-test - just serve that folder on localhost:

```html
<html>

<body>
    <style>
        #outgoing {
            width: 600px;
            word-wrap: break-word;
            white-space: normal;
        }
    </style>
    <div>
        <p>incoming video for peer i</p>
        <video id="vid1" autoplay muted></video>
    </div>
    <div>
        <p>incoming video for peer ni</p>
        <video id="vid2" autoplay muted></video>
    </div>
    <script src="simplepeer.min.js"></script>
    <script>
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            const iVid = document.getElementById("vid1"); // incoming video for peer i
            const niVid = document.getElementById("vid2"); // incoming video for peer ni

            const i = new SimplePeer({ // initiator
                initiator: true,
                trickle: true,
                // streams: [ stream ]
            })
            const ni = new SimplePeer({ // non-initiator
                initiator: false,
                trickle: true
            });
            i.on('error', err => console.log('error', err))
            i.on('signal', data => {
                ni.signal(data);
            });
            i.on('connect', () => {
                console.log('i: connected')

                setInterval(() => {
                    i.send('whatever' + Math.random());
                }, 2000 + 1000 * Math.random());

                // Add a stream and remove it 5 seconds later.
                function addStreamRemoveStream() {
                    console.log("i: Sending stream to ni.");
                    i.addStream(stream);
                    setTimeout(() => {
                        console.log("i: Stop sending stream to ni.");
                        i.removeStream(stream);
                    }, 5000);
                }
                // call every 10 seconds.
                setInterval(() => {
                    addStreamRemoveStream();
                }, 10000);
                addStreamRemoveStream();
            })
            i.on('data', data => {
                console.log('ni -> i: ' + data)
            });
            i.on('stream', (stream) => {
                iVid.srcObject = stream;
            });
            /****************************************/
            ni.on('error', err => console.log('error', err))
            ni.on('signal', data => {
                i.signal(data);
            });
            ni.on('connect', () => {
                console.log('ni: connected')
                setInterval(() => {
                    ni.send('whatever' + Math.random());
                }, 2000 + 1000 * Math.random());

                ni.addStream(stream);
            })
            ni.on('data', data => {
                console.log('i -> ni: ' + data)
            });
            ni.on('stream', (stream) => {
                console.log("ni: Got a stream.");
                niVid.srcObject = stream;
            });
        })();
    </script>
</body>

</html>
```

Visit `index.html` from your browser there are two peers in the file i (initiator) and ni (non-initiator).
These two connecto to each other, they addStreams and keep sending each other data. Also i keeps on adding and
removing stream to show case dynamic ability to add and remove streams.

### A simpler example

This example create two peers **in the same web page**.

In a real-world application, *you would never do this*. The sender and receiver `Peer`
instances would exist in separate browsers. A "signaling server" (usually implemented with
websockets) would be used to exchange signaling data between the two browsers until a
peer-to-peer connection is established.

### data channels

```js
var Peer = require('simple-peer')

var peer1 = new Peer({ initiator: true })
var peer2 = new Peer()

peer1.on('signal', data => {
  // when peer1 has signaling data, give it to peer2 somehow
  peer2.signal(data)
})

peer2.on('signal', data => {
  // when peer2 has signaling data, give it to peer1 somehow
  peer1.signal(data)
})

peer1.on('connect', () => {
  // wait for 'connect' event before using the data channel
  peer1.send('hey peer2, how is it going?')
})

peer2.on('data', data => {
  // got a data channel message
  console.log('got a message from peer1: ' + data)
})
```

### video/voice

Video/voice is also super simple! In this example, peer1 sends video to peer2.

```js
var Peer = require('simple-peer')

// get video/voice stream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(gotMedia).catch(() => {})

function gotMedia (stream) {
  var peer1 = new Peer({ initiator: true, stream: stream })
  var peer2 = new Peer()

  peer1.on('signal', data => {
    peer2.signal(data)
  })

  peer2.on('signal', data => {
    peer1.signal(data)
  })

  peer2.on('stream', stream => {
    // got remote video stream, now let's show it in a video tag
    var video = document.querySelector('video')

    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }

    video.play()
  })
}
```

For two-way video, simply pass a `stream` option into both `Peer` constructors. Simple!

Please notice that `getUserMedia` only works in [pages loaded via **https**](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Encryption_based_security).

### dynamic video/voice

It is also possible to establish a data-only connection at first, and later add
a video/voice stream, if desired.

```js
var Peer = require('simple-peer') // create peer without waiting for media

var peer1 = new Peer({ initiator: true }) // you don't need streams here
var peer2 = new Peer()

peer1.on('signal', data => {
  peer2.signal(data)
})

peer2.on('signal', data => {
  peer1.signal(data)
})

peer2.on('stream', stream => {
  // got remote video stream, now let's show it in a video tag
  var video = document.querySelector('video')

  if ('srcObject' in video) {
    video.srcObject = stream
  } else {
    video.src = window.URL.createObjectURL(stream) // for older browsers
  }

  video.play()
})

function addMedia (stream) {
  peer1.addStream(stream) // <- add streams to peer dynamically
}

// then, anytime later...
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(addMedia).catch(() => {})
```

### in node

To use this library in node, pass in `opts.wrtc` as a parameter (see [the constructor options](#peer--new-peeropts)):

```js
var Peer = require('simple-peer')
var wrtc = require('wrtc')

var peer1 = new Peer({ initiator: true, wrtc: wrtc })
var peer2 = new Peer({ wrtc: wrtc })
```

## api

### `peer = new Peer([opts])`

Create a new WebRTC peer connection.

A "data channel" for text/binary communication is always established, because it's cheap and often useful. For video/voice communication, pass the `stream` option.

If `opts` is specified, then the default options (shown below) will be overridden.

```
{
  initiator: false,
  channelConfig: {},
  channelName: '<random string>',
  config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] },
  offerOptions: {},
  answerOptions: {},
  sdpTransform: function (sdp) { return sdp },
  stream: false,
  streams: [],
  trickle: true,
  allowHalfTrickle: false,
  wrtc: {}, // RTCPeerConnection/RTCSessionDescription/RTCIceCandidate
  objectMode: false
}
```

The options do the following:

- `initiator` - set to `true` if this is the initiating peer
- `channelConfig` - custom webrtc data channel configuration (used by [`createDataChannel`](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel))
- `channelName` - custom webrtc data channel name
- `config` - custom webrtc configuration (used by [`RTCPeerConnection`](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) constructor)
- `offerOptions` - custom offer options (used by [`createOffer`](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer) method)
- `answerOptions` - custom answer options (used by [`createAnswer`](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer) method)
- `sdpTransform` - function to transform the generated SDP signaling data (for advanced users)
- `stream` - if video/voice is desired, pass stream returned from [`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- `streams` - an array of MediaStreams returned from [`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- `trickle` - set to `false` to disable [trickle ICE](http://webrtchacks.com/trickle-ice/) and get a single 'signal' event (slower)
- `wrtc` - custom webrtc implementation, mainly useful in node to specify in the [wrtc](https://npmjs.com/package/wrtc) package. Contains an object with the properties:
  - [`RTCPeerConnection`](https://www.w3.org/TR/webrtc/#dom-rtcpeerconnection)
  - [`RTCSessionDescription`](https://www.w3.org/TR/webrtc/#dom-rtcsessiondescription)
  - [`RTCIceCandidate`](https://www.w3.org/TR/webrtc/#dom-rtcicecandidate)

- `objectMode` - set to `true` to create the stream in [Object Mode](https://nodejs.org/api/stream.html#stream_object_mode). In this mode, incoming string data is not automatically converted to `Buffer` objects.

### `peer.signal(data)`

Call this method whenever the remote peer emits a `peer.on('signal')` event.

The `data` will encapsulate a webrtc offer, answer, or ice candidate. These messages help
the peers to eventually establish a direct connection to each other. The contents of these
strings are an implementation detail that can be ignored by the user of this module;
simply pass the data from 'signal' events to the remote peer and call `peer.signal(data)`
to get connected.

### `peer.send(data)`

Send text/binary data to the remote peer. `data` can be any of several types: `String`,
`Buffer` (see [buffer](https://github.com/feross/buffer)), `ArrayBufferView` (`Uint8Array`,
etc.), `ArrayBuffer`, or `Blob` (in browsers that support it).

Note: If this method is called before the `peer.on('connect')` event has fired, then data
will be buffered.

### `peer.addStream(stream)`

Add a `MediaStream` to the connection.

### `peer.removeStream(stream)`

Remove a `MediaStream` from the connection.

### `peer.destroy([err])`

Destroy and cleanup this peer connection.

If the optional `err` parameter is passed, then it will be emitted as an `'error'`
event on the stream.

### `Peer.WEBRTC_SUPPORT`

Detect native WebRTC support in the javascript environment.

```js
var Peer = require('simple-peer')

if (Peer.WEBRTC_SUPPORT) {
  // webrtc support!
} else {
  // fallback
}
```

### duplex stream

`Peer` objects are instances of `stream.Duplex`. They behave very similarly to a
`net.Socket` from the node core `net` module. The duplex stream reads/writes to the data
channel.

```js
var peer = new Peer(opts)
// ... signaling ...
peer.write(new Buffer('hey'))
peer.on('data', function (chunk) {
  console.log('got a chunk', chunk)
})
```

## events

`Peer` objects are instance of `EventEmitter`. Take a look at the [nodejs events documentation](https://nodejs.org/api/events.html) for more information.

Example of removing all registered **close**-event listeners:
```js
peer.removeAllListeners('close')
```

### `peer.on('signal', data => {})`

Fired when the peer wants to send signaling data to the remote peer.

**It is the responsibility of the application developer (that's you!) to get this data to
the other peer.** This usually entails using a websocket signaling server. This data is an
`Object`, so  remember to call `JSON.stringify(data)` to serialize it first. Then, simply
call `peer.signal(data)` on the remote peer.

(Be sure to listen to this event immediately to avoid missing it. For `initiator: true`
peers, it fires right away. For `initatior: false` peers, it fires when the remote
offer is received.)

### `peer.on('connect', () => {})`

Fired when the peer connection and data channel are ready to use.

### `peer.on('data', data => {})`

Received a message from the remote peer (via the data channel).

`data` will be either a `String` or a `Buffer/Uint8Array` (see [buffer](https://github.com/feross/buffer)).

### `peer.on('stream', stream => {})`

Received a remote video stream, which can be displayed in a video tag:

```js
peer.on('stream', stream => {
  var video = document.querySelector('video')
  if ('srcObject' in video) {
    video.srcObject = stream
  } else {
    video.src = window.URL.createObjectURL(stream)
  }
  video.play()
})
```

### `peer.on('close', () => {})`

Called when the peer connection has closed.

### `peer.on('error', (err) => {})`

Fired when a fatal error occurs. Usually, this means bad signaling data was received from the remote peer.

`err` is an `Error` object.

## error codes

Errors returned by the `error` event have an `err.code` property that will indicate the origin of the failure.

Possible error codes:
- `ERR_WEBRTC_SUPPORT`
- `ERR_CREATE_OFFER`
- `ERR_CREATE_ANSWER`
- `ERR_SET_LOCAL_DESCRIPTION`
- `ERR_SET_REMOTE_DESCRIPTION`
- `ERR_ADD_ICE_CANDIDATE`
- `ERR_ICE_CONNECTION_FAILURE`
- `ERR_SIGNALING`
- `ERR_DATA_CHANNEL`
- `ERR_CONNECTION_FAILURE`


## connecting more than 2 peers?

The simplest way to do that is to create a full-mesh topology. That means that every peer
opens a connection to every other peer. To illustrate:

![full mesh topology](img/full-mesh.png)

To broadcast a message, just iterate over all the peers and call `peer.send`.

So, say you have 3 peers. Then, when a peer wants to send some data it must send it 2
times, once to each of the other peers. So you're going to want to be a bit careful about
the size of the data you send.

Full mesh topologies don't scale well when the number of peers is very large. The total
number of edges in the network will be ![full mesh formula](img/full-mesh-formula.png)
where `n` is the number of peers.

For clarity, here is the code to connect 3 peers together:

#### Peer 1

```js
// These are peer1's connections to peer2 and peer3
var peer2 = new Peer({ initiator: true })
var peer3 = new Peer({ initiator: true })

peer2.on('signal', data => {
  // send this signaling data to peer2 somehow
})

peer2.on('connect', () => {
  peer2.send('hi peer2, this is peer1')
})

peer2.on('data', data => {
  console.log('got a message from peer2: ' + data)
})

peer3.on('signal', data => {
  // send this signaling data to peer3 somehow
})

peer3.on('connect', () => {
  peer3.send('hi peer3, this is peer1')
})

peer3.on('data', data => {
  console.log('got a message from peer3: ' + data)
})
```

#### Peer 2

```js
// These are peer2's connections to peer1 and peer3
var peer1 = new Peer()
var peer3 = new Peer({ initiator: true })

peer1.on('signal', data => {
  // send this signaling data to peer1 somehow
})

peer1.on('connect', () => {
  peer1.send('hi peer1, this is peer2')
})

peer1.on('data', data => {
  console.log('got a message from peer1: ' + data)
})

peer3.on('signal', data => {
  // send this signaling data to peer3 somehow
})

peer3.on('connect', () => {
  peer3.send('hi peer3, this is peer2')
})

peer3.on('data', data => {
  console.log('got a message from peer3: ' + data)
})
```

#### Peer 3

```js
// These are peer3's connections to peer1 and peer2
var peer1 = new Peer()
var peer2 = new Peer()

peer1.on('signal', data => {
  // send this signaling data to peer1 somehow
})

peer1.on('connect', () => {
  peer1.send('hi peer1, this is peer3')
})

peer1.on('data', data => {
  console.log('got a message from peer1: ' + data)
})

peer2.on('signal', data => {
  // send this signaling data to peer2 somehow
})

peer2.on('connect', () => {
  peer2.send('hi peer2, this is peer3')
})

peer2.on('data', data => {
  console.log('got a message from peer2: ' + data)
})
```

## memory usage

If you call `peer.send(buf)`, `simple-peer` is not keeping a reference to `buf`
and sending the buffer at some later point in time. We immediately call
`channel.send()` on the data channel. So it should be fine to mutate the buffer
right afterward.

However, beware that `peer.write(buf)` (a writable stream method) does not have
the same contract. It will potentially buffer the data and call
`channel.send()` at a future point in time, so definitely don't assume it's
safe to mutate the buffer.


## connection does not work on some networks?

If a direct connection fails, in particular, because of NAT traversal and/or firewalls,
WebRTC ICE uses an intermediary (relay) TURN server. In other words, ICE will first use
STUN with UDP to directly connect peers and, if that fails, will fall back to a TURN relay
server.

In order to use a TURN server, you must specify the `config` option to the `Peer`
constructor. See the API docs above.

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
