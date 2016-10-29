const R = require('ramda')
const webmidi = require('webmidi')
const AudioManager = require('audio-manager')

const kit = require('./kit')
const drumming = require('./drumming.html')

document.addEventListener('DOMContentLoaded', function () {
  const audioManager = new AudioManager(['drums'])
  const body = document.getElementsByTagName('body')[0]
  const midi = document.getElementById('midi-input')

  audioManager.init()
  audioManager.settings.audioPath = '/'
  audioManager.setVolume('drums', 1)

  const drums = R.mapObjIndexed(function (piece) {
    return piece.map(function (variant) {
      const sound = audioManager.createSound(variant.replace('.mp3', ''))
      sound.load()
      return sound
    })
  }, kit)

  const noteMap = {
    'C-1': drums.kick,
    'D-1': drums.snare,
    'E-1': drums.rim,
    'C0': drums.tom1,
    'A-1': drums.tom2,
    'G-1': drums.tom3,
    'A#-1': drums.hihatOpened,
    'G#-1': drums.hihatClose,
    'F#-1': drums.hihatClosed,
    'C#0': drums.crash,
    'D#0': drums.ride
  }

  body.innerHTML = drumming

  const svgMap = {
    kick: drums.kick,
    tom1: drums.tom1,
    tom2: drums.tom2,
    tom3: drums.tom3,
    hihat: drums.hihatClosed,
    snare: drums.snare,
    ride: drums.ride,
    crash: drums.crash
  }

  Object.keys(svgMap).forEach(function (piece) {
    console.log(piece)
    const el = document.getElementById(piece)
    el.onclick = function () {
      svgMap[piece][0].play()
    }
  })

  webmidi.enable(function (err) {
    if (err) {
      midi.innerHTML = "Sorry, your browser doesn't support Web MIDI"
      return
    }

    const selector = document.getElementById('devices-select')
    const connect = document.getElementById('device-connect-button')
    const kick = document.getElementById('Kick')

    if (webmidi.inputs.length <= 0) {
      midi.innerHTML = "No MIDI inputs found on your system."
      return
    }

    selector.innerHTML =
      webmidi.inputs.reduce(function (memo, input) {
        return memo +
          '<option value="' + input.name + '">' +
            input.name +
          '</option>'
      }, '')

    connect.onclick = function (event) {
      const input = webmidi.getInputByName(selector.value)
      connect.disabled = true

      var last = null
      input.addListener('noteon', 'all', function (e) {
        const key = e.note.name + e.note.octave
        const weight = Math.round(e.velocity * noteMap[key].length) - 1

        if (last && drums.hihatOpened.indexOf(last) >= 0) {
          last.stop()
        }

        last = noteMap[key][weight]
        last.play()
      })
    }

  })

}, false)