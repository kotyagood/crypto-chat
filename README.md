# Crypto Chat

It is simple web-based messenger that provides end-2-end encryption based on
WebAssembly build of libsodium. It was made as part of my school project
related to cryptography and open for usage and education.

It consists 2 parts:

* Backend
* Fronten

## Backend

It is small NodeJS based app. It transfer encrypted messenges form client to client and when new clients connect
it notifies connected client about it to update roster.

It is based on Socket.io.

## Frontend

It is based on React and uses Materialize CSS to provide responsive and modern looking UI.
For cryptography it uses WebAssembly build of libsodium.