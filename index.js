/*
 * This file is part of nm-state
 *
 * nm-state is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * nm-state is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with nm-state.  If not, see <http://www.gnu.org/licenses/>.
 */

var events = require('events')
var DBus = require('dbus')

var bus = new DBus().getBus('system')
var monitor = new events.EventEmitter()
var state = 0
var inited = false

function gotError (err) {
  process.nextTick(monitor.emit.bind(monitor, 'error', err))
}

function init () {
  inited = true
  bus.getInterface('org.freedesktop.NetworkManager',
    '/org/freedesktop/NetworkManager',
    'org.freedesktop.NetworkManager',
    function (err, iface) {
      if (err) return gotError(err)
      iface.getProperty('state', function (err, value) {
        if (err) return gotError(err)
        monitor.emit('state', value)
      })
      iface.on('StateChanged', function (value) {
        monitor.emit('state', value)
      })
    }
  )
}

module.exports = function (onState) {
  monitor.on('state', onState)
  if (inited) {
    onState(state)
  } else {
    init()
  }
}

module.exports.UNKNOWN = 0
module.exports.ASLEEP = 10
module.exports.DISCONNECTED = 20
module.exports.DISCONNECTING = 30
module.exports.CONNECTING = 40
module.exports.CONNECTED_LOCAL = 50
module.exports.CONNECTED_SITE = 60
module.exports.CONNECTED_GLOBAL = 70
module.exports.stateNames = {
  0: 'unknown',
  10: 'asleep',
  20: 'disconnected',
  30: 'disconnecting',
  40: 'connecting',
  50: 'connected_local',
  60: 'connected_site',
  70: 'connected_global'
}
