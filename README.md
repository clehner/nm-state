# nm-state

Get the state of NetworkManager. Get notifications when the state changes, i.e.
when your computer gets connected and disconnected from the Internet.

## Usage

```
npm install nm-state
```
```js
var nmState = require('nm-state')
nmState(function (state) {
  if (state >= nmState.CONNECTED_SITE ) {
    console.log('probably connected to the internet.')
  } else {
    console.log('probably not connected to the internet.')
  }
})
```

Code and state may be one of the following:
```
0: 'unknown'
10: 'asleep'
20: 'disconnected'
30: 'disconnecting'
40: 'connecting'
50: 'connected_local'
60: 'connected_site'
70: 'connected_global'
```

## License

GPLv3+
