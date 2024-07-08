import {io} from 'socket.io-client'
const server = io('http://localhost:5000/')
//const server = io('https://chat-server-ig3y.onrender.com')
// const server = io('https://chatapp-server-txz2.onrender.com');
// const server = io('https://chatapp-server-txz2.onrender.com', {
//     reconnection: true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
//     timeout: 20000
//   });

export default server