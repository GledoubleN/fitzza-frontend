importScripts(
  'https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js')

const config = JSON.parse(
  new URL(self.location.href).searchParams.get('config'))

if (config) {
  firebase.initializeApp(config)
  firebase.messaging()
}