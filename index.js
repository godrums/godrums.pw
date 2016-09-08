const R = require('ramda')
const webmidi = require('webmidi')
const AudioManager = require('audio-manager')

webmidi.enable(function (err) {
  if (err) {
    console.log('error')
    return
  }

  const audioManager = new AudioManager(['drums'])
  audioManager.init()
  audioManager.settings.audioPath = '/samples/'
  audioManager.setVolume('drums', 1)

  const kit = {
    kick: 'kick',
    snare: 'snare',
    tom1: 'tom1',
    tom2: 'tom2',
    tom3: 'tom3',
    hihatOpened: 'hihat-opened',
    hihatClose: 'hihat-close',
    hihatClosed: 'hihat-closed',
    crash: 'crash',
    ride: 'ride'
  }

  const drums = R.mapObjIndexed(function (piece) {
    const sound = audioManager.createSound(piece)
    sound.load()
    return sound
  }, kit)

  const map = {
    'C-1': drums.kick,
    'D-1': drums.snare,
    'C0': drums.tom1,
    'A-1': drums.tom2,
    'G-1': drums.tom3,
    'A#-1': drums.hihatOpened,
    'G#-1': drums.hihatClose,
    'F#-1': drums.hihatClosed,
    'C#0': drums.crash,
    'D#0': drums.ride
  }

  const selector = document.getElementById('devices-select')
  const connect = document.getElementById('device-connect-button')

  selector.innerHTML =
    webmidi.inputs.reduce(function (memo, input) {
      return memo +
        '<option value="' + input.name + '">' +
        input.name +
        '</option>'
    }, '')

  connect.onclick = function (event) {
    if (!selector.value) {
      window.alert('No MIDI device')
      return
    }

    const input = webmidi.getInputByName(selector.value)
    connect.disabled = true

    input.addListener('noteon', 'all', function (e) {
      const key = e.note.name + e.note.octave
      map[key].play()
    })
  }

})
