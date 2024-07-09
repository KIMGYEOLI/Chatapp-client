// import React,{ useState, useEffect } from "react"; 
// import "./App.css";
// import socket from "./utils/socket";
// import InputField from "./components/InputField/InputField";
// import MessageContainer from "./components/MessageContainer/MessageContainer";

// function App() {

//   const [user, setUser] = useState(""); // 유저 정보 저장
//   const [message, setMessage] = useState(''); // 메세지 저장 
//   const [messageList, setMessageList] = useState([]);
//   console.log("message List", messageList);

//   const askUserName=()=>{
//     const userName = prompt("이름을 입력하세요.");
//     setUser(userName);
//     console.log("userName:", userName);

//     socket.emit("login", userName, (res) => {
//       console.log("Res", res);
//       if(res?.ok) {
//         setUser(res.data);
//       }
//     });
//   };

//   useEffect(() => {
//     socket.on("message", (message) => {
//       console.log("message", message);
//       setMessageList((prevMessages) => [...prevMessages, message]);
//     });
//     askUserName();

//     return () => {
//       socket.off("message");
//     };
//   }, []); // 빈 배열로 설정하여 한 번만 실행되도록 함

//   const sendMessage = (event) => {
//     event.preventDefault();
//     socket.emit("sendMessage", message, (res) => {
//       console.log("sendMessage res", res);
//       if(res.ok) {
//         setMessage("");
//       }
//     });
//     //setMessageList((prevState) => prevState.concat(message));
//     setMessageList((prevState) => prevState.concat({ user: { name: user }, chat: message }));
//     setMessage(""); // 메세지 전송 후 입력 필드 비우기
//   };
  
//   return (
//     <div>
//       <div className="App">
//         <MessageContainer messageList={messageList} user={user} />
//         <InputField 
//           message={message} 
//           setMessage={setMessage} 
//           sendMessage={sendMessage}
//         />
//       </div>
//     </div>
//   );
// }


// export default App;

// import React, { useEffect, useRef ,useState } from "react";
// import server from "./server";
// import "./App.css";

// function App() {
//   const [isLogin, setIsLogin] = useState(false); // 로그인 상태 저장
//   const [nickName, setNickName] = useState(""); // 닉네임 저장
//   const [msg, setMsg] = useState([]); // 메시지 리스크 저장

//   const msg_ref = useRef(""); // 메시지 입력 필드 참조
//   const nickname_ref = useRef(""); // 닉네임 입력 필드 참조
//   const scroll_ref = useRef(0);  // 채팅 창 스크롤 참조
//   const video_ref = useRef(null);

//   function handleLoginClick() {
//     if(nickname_ref.current && nickname_ref.current.value) {
//       server.emit('login', nickname_ref.current.value);
//       setIsLogin(true);
//       setNickName(nickname_ref.current.value);
//     }
//   }

//   function handleLoginKeyClick(e) {
//     if(e.key === 'Enter') {
//       handleLoginClick();
//     }
//   }

//   function handleSendClick() {
//     if(msg_ref.current.value !== "") {
//       let msg_array = [...msg]
//       msg_array.push({level:"me", msg:msg_ref.current.value});
//       setMsg(msg_array);
//       server.emit('send', {nickName:nickName, msg:msg_ref.current.value});
//       msg_ref.current.value = "";
//     }
//   }

//   function handleSendKeyClick(e) {
//     if(e.key === 'Enter') {
//       handleSendClick();
//     }
//   }

//   useEffect(() => {
//     if(scroll_ref.current) {
//       scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight;
//     }

//     server.on('msg', (data) => {
//       let msg_array = [...msg];
//       msg_array.push(data);
//       setMsg(msg_array);
//     });

//     if(msg_ref.current && msg[msg.length -1].level === "me") {
//       msg_ref.current.value = "";
//     }
//   }, []);

//   useEffect(() => {
//     const video = video_ref.current;

//     if(video) {
//       const handleVideoEnd = () => {
//         video.currentTime = 0;
//         video.play();
//       };

//       video.addEventListener('ended', handleVideoEnd);

//       return () => {
//         video.removeEventListener('ended', handleVideoEnd);
//       };
//     };
//   }, []);

//   return (
//     <div className="App">
//       {!isLogin ?
//       <div className="login">
//         {/* <video ref={video_ref} autoPlay muted loop>
//           <source src="/하늘.mp4" type="video/mp4" />
//         </video> */}
//         <div className="login_wrapper">
//           <div className="name">名前を入力してください <input ref={nickname_ref} onKeyDown={handleLoginKeyClick}></input></div>
//           <button onClick={handleLoginClick} className="enter_btn"></button>
//         </div>
//       </div>
//       :
//       <div className="chatting">
//         <div className="chatting_wrapper">
//           <div ref={scroll_ref} className='chatting_box'>
//             {msg.map(c=>{
//               return <div className='msg_box'
//                   style={{
//                     justifyContent: c.level == "sys" ? "center" : c.level == "" ? "start" : "end"}}>
//                     <div className={c.level == "sys" ? 'msg_center' : "msg"}>{c.msg}</div>
//                     <div className='nickname_style'>{c.nickName}</div> {/* 메세지 보낸 사람 닉네임 표시 */}
                    
//                 </div>
//             })
//             }
//           </div>

//           <div className="input_box">
//             <input ref={msg_ref} onKeyDown={handleSendKeyClick}></input>
//             <div className="box"></div>
//             <button onClick={handleSendClick}>send</button>
//           </div>
//         </div>
//       </div>  
//     }
//     </div>
//   );
// }

// export default App;

// import React, { useEffect, useRef, useState } from "react";
// import server from "./server";
// import CustomDate from "./CustomDate";
// import Sidebar from "./Sidebar";
// import "./App.css";
// import "./Sidebar.css";


// function App() {
//   const [isLogin, setIsLogin] = useState(false); // 로그인 상태 저장
//   const [nickName, setNickName] = useState(""); // 닉네임 저장
//   const [msg, setMsg] = useState([]); // 메시지 리스트 저장
//   const [dateMsg, setDateMsg] = useState([]);
//   const [userList, setUserList] = useState([]); // 사용자 목록 저장

//   const msg_ref = useRef(""); // 메시지 입력 필드 참조
//   const nickname_ref = useRef(""); // 닉네임 입력 필드 참조
//   const scroll_ref = useRef(null);  // 채팅 창 스크롤 참조


//   function handleLoginClick() {
//     if (nickname_ref.current && nickname_ref.current.value) {
//       setMsg([]); //로그인 시 채팅창 초기화 
//       server.emit('login', nickname_ref.current.value);
//       setIsLogin(true);
//       setNickName(nickname_ref.current.value);
//     }
//   }

//   function handleLoginKeyClick(e) {
//     if (e.key === 'Enter') {
//       handleLoginClick();
//     }
//   }

//   function handleSendClick() {
//     if (msg_ref.current.value !== "") {
//       let msg_array = [...msg]
//       msg_array.push({ level: "me", msg: msg_ref.current.value });
//       setMsg(msg_array);
//       server.emit('sendMessage', { nickName: nickName, msg: msg_ref.current.value });
//       msg_ref.current.value = "";
//     }
//   }

//   function handleSendKeyClick(e) {
//     if (e.key === 'Enter') {
//       handleSendClick();
//     }
//   }

//   // useEffect(() => {
//   //   const handleMessage = (data) => {
//   //     setMsg(prevMsg => [...prevMsg, data]);
//   //   };
//   useEffect(() => {
//     const handleMessage = (data) => {
//       if (data.level === "date") {
//         setDateMsg(data.msg);
//       } else {
//         setMsg(prevMsg => [...prevMsg, data]);
//       }
//     };

//     const handleUpdateUserList = (users) => {
//       setUserList(users);
//     };

//     server.on('msg', handleMessage);
//     server.on('updateUserList', handleUpdateUserList);

//     return () => {
//       server.off('msg', handleMessage);
//       server.off('updateUserList', handleUpdateUserList);
//     };
//   }, []);

//   useEffect(() => {
//     if (scroll_ref.current) {
//       scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight;
//     }
//   }, [msg, dateMsg]);

//   return (
//     <div className="App">
//       {!isLogin ?
//         <div className="login">
//           <div className="login_wrapper">
//             <div className="name">名前を入力してください <input ref={nickname_ref} onKeyDown={handleLoginKeyClick}></input></div>
//             <button onClick={handleLoginClick} className="enter_btn"></button>
//           </div>
//         </div>
//         :
//         <div className="chat-container">
//           <Sidebar userList={userList} />
//         <div className="chatting">
//           <div className="chatting_wrapper">
//             <div ref={scroll_ref} className='chatting_box'>
//               <div><CustomDate /></div>
//               {msg.map((c, index) => (
//                 <div key={index} className='msg_box' 
//                   style={{
//                     justifyContent: c.level === "sys" ? "center" : c.level === "me" ? "end" : "start"
//                   }}>
//                     {c.level !== "sys" && c.level !== 'me' && <img src="/몰티즈4.png" alt="" className="avatar"/>}
//                   <div className={c.level === "sys" ? 'msg_center' : c.level === "me" ? "msg_me" : "msg_other"}>{c.msg}</div>
//                   {c.level !== "sys" && <div className='nickname_style'>{c.nickName}</div>}
//                 </div>
//               ))}
//             </div>
            

//             <div className="input_box">
//               <input ref={msg_ref} onKeyDown={handleSendKeyClick}></input>
//               <div className="box"></div>
//               <button onClick={handleSendClick}></button>
//             </div>
//           </div>
//         </div>
//       </div>
//       }
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useRef, useState } from "react";
// import server from "./server";
// import CustomDate from "./components/CustomDate";
// import Sidebar from "./components/Sidebar/Sidebar"; // 파일명과 일치시킴
// import "./App.css";
// import "./components/Sidebar/Sidebar.css";

// function App() {
//   const [isLogin, setIsLogin] = useState(false); // 로그인 상태 저장
//   const [nickName, setNickName] = useState(""); // 닉네임 저장
//   const [msg, setMsg] = useState([]); // 메시지 리스트 저장
//   const [dateMsg, setDateMsg] = useState([]);
//   const [userList, setUserList] = useState([]); // 사용자 목록 저장

//   const msg_ref = useRef(""); // 메시지 입력 필드 참조
//   const nickname_ref = useRef(""); // 닉네임 입력 필드 참조
//   const scroll_ref = useRef(null);  // 채팅 창 스크롤 참조

//   function handleLoginClick() {
//     if (nickname_ref.current && nickname_ref.current.value) {
//       setMsg([]); // 로그인 시 채팅창 초기화 
//       server.emit('login', nickname_ref.current.value);
//       setIsLogin(true);
//       setNickName(nickname_ref.current.value);
//     }
//   }

//   function handleLoginKeyClick(e) {
//     if (e.key === 'Enter') {
//       handleLoginClick();
//     }
//   }

  // function handleSendClick() {
    // if (msg_ref.current.value !== "") {
    //   let msg_array = [...msg];
    //   msg_array.push({ level: "me", msg: msg_ref.current.value });
    //   // setMsg(msg_array);
    //   server.emit('sendMessage', { nickName: nickName, msg: msg_ref.current.value });
    //   msg_ref.current.value = "";
  //   }
  // }

//   function handleSendKeyClick(e) {
//     if (e.key === 'Enter') {
//       handleSendClick();
//     }
//   }

//   useEffect(() => {
//     const handleMessage = (data) => {
//       if (data.level === "date") {
//         setDateMsg(data.msg);
//       } else {
//         setMsg(prevMsg => [...prevMsg, data]);
//       }
//     };

//     const handleUpdateUserList = (users) => {
//       setUserList(users);
//       console.log('users >> ', users);
//     };

//     server.on('msg', handleMessage);
//     server.on('updateUserList', handleUpdateUserList);

//     return () => {
//       server.off('msg', handleMessage);
//       server.off('updateUserList', handleUpdateUserList);
//     };
//   }, []);

//   useEffect(() => {
//     if (scroll_ref.current) {
//       scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight;
//     }
//   }, [msg, dateMsg]);

//   return (
//     <div className="App">
//       {!isLogin ?
//         <div className="login">
//           <div className="login_wrapper">
//             <div className="name">名前を入力してください <input ref={nickname_ref} onKeyDown={handleLoginKeyClick}></input></div>
//             <button onClick={handleLoginClick} className="enter_btn"></button>
//           </div>
//         </div>
//         :
        // <div className="chat-container">
        //   <Sidebar userList={userList} />
        //   <div className="chatting">
        //     <div className="chatting_wrapper">
        //       <div ref={scroll_ref} className='chatting_box'>
        //         <div><CustomDate /></div>
        //         {msg.map((c, index) => (
        //           <div key={index} className='msg_box' 
        //             style={{
        //               justifyContent: c.level === "sys" ? "center" : c.level === "me" ? "end" : "start"
        //             }}>
        //             {c.level !== "sys" && c.level !== 'me' && <img src="/몰티즈4.png" alt="" className="avatar"/>}
        //             <div className={c.level === "sys" ? 'msg_center' : c.level === "me" ? "msg_me" : "msg_other"}>{c.msg}</div>
        //             {c.level !== "sys" && c.level !== 'me' && <div className='nickname_style'>{c.nickName}</div>}
        //           </div>
        //         ))}
        //       </div>
        //       <div className="input_box">
        //         <input ref={msg_ref} onKeyDown={handleSendKeyClick}></input>
        //         <div className="box"></div>
        //         <button onClick={handleSendClick}></button>
        //       </div>
        //     </div>
        //   </div>
        // </div>
//       }
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useRef, useState } from "react";
import server from "./server";
import ChatRoomList from "./components/ChatRoom/ChatRoomList";
import ChatInterface from "./components/ChatRoom/ChatInterface";
import Sidebar from './components/Sidebar/Sidebar';
import "./App.css";
import "./components/Sidebar/Sidebar.css";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [nickName, setNickName] = useState("");
  const [userList, setUserList] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [roomList, setRoomList] = useState([
    { roomName: "송탁쿤 정신차리자", createdBy: "a" },
    { roomName: "🍟감튀를 사랑하는 자들🍟", createdBy: "a" },
    { roomName: "Room3", createdBy: "a" }
  ]);
  // const [roomList, setRoomList] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);
  const [messages, setMessages] = useState([]);

  const nickname_ref = useRef("");

  const handleLoginClick = () => {
    if (nickname_ref.current && nickname_ref.current.value) {
      server.emit('login', nickname_ref.current.value);
      setIsLogin(true);
      setNickName(nickname_ref.current.value);
    }
  };

  const handleLoginKeyClick = (e) => {
    if (e.key === 'Enter') {
      handleLoginClick();
    }
  };

  const handleJoinRoom = (roomName) => {
    console.log(`Join room: ${roomName}`);
    if(currentRoom) {
      server.emit('leaveRoom', { roomName: currentRoom, nickName });
    }
    server.emit('joinRoom', { roomName, nickName });
    setMessages([]);
    setCurrentRoom(roomName);
  };

  const handleCreateRoom = (roomName) => {
    setRoomList([...roomList, { roomName, createdBy: nickName }]);
    server.emit('createRoom', { roomName, createdBy: nickName });
  };

  const handleDeleteRoom = ({ roomName, requestedBy }) => {
    const roomToDelete = roomList.find(room => room.roomName === roomName);
    if (roomToDelete && roomToDelete.createdBy === requestedBy) {
      setRoomList(roomList.filter(room => room.roomName !== roomName));
      server.emit('deleteRoom', { roomName, requestedBy });
    } else {
      alert("방을 삭제할 권한이 없습니다.");
    }
  };

  const handleSendMessage = (message) => {
    server.emit('sendMessage', { roomName: currentRoom, nickName, msg: message });
    // 클라이언트에서 보내는 메시지는 따로 처리
    setMessages(prevMessages => [...prevMessages, { level: "me", msg: message, nickName }]);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleRoomList = () => {
    setShowRoomList(!showRoomList);
  };

  useEffect(() => {
    const handleMsg = (data) => {
      if (data.nickName !== nickName) { // 자신의 메시지는 따로 처리하지 않음
        console.log(data.msg);
        setMessages(prevMessages => [...prevMessages, data]);
      }
    };

    const handleJoinRoomSuccess = ({ roomName }) => {
      console.log(`Joined room: ${roomName}`);
      setCurrentRoom(roomName);
    };

    const handleJoinRoomFail = ({ msg }) => {
      alert(msg);
    };

    const handleUpdateUserList = (users) => {
      setUserList(users);
      console.log('users >> ', users);
    };

    const handleUpdateRoomList = (rooms) => {
      setRoomList(rooms);
      console.log('rooms >> ', rooms);
    };

    const handleRoomDeleted = (data) => {
      alert(data.msg);
      setCurrentRoom("");
    };

    server.on('msg', handleMsg);
    server.on('joinRoomSuccess', handleJoinRoomSuccess);
    server.on('joinRoomFail', handleJoinRoomFail);
    server.on('updateUserList', handleUpdateUserList);
    server.on('updateRoomList', handleUpdateRoomList);
    server.on('roomDeleted', handleRoomDeleted);

    return () => {
      server.off('msg', handleMsg);
      server.off('joinRoomSuccess', handleJoinRoomSuccess);
      server.off('joinRoomFail', handleJoinRoomFail);
      server.off('updateUserList', handleUpdateUserList);
      server.off('updateRoomList', handleUpdateRoomList);
      server.off('roomDeleted', handleRoomDeleted);
    };
  }, [nickName]);

  return (
    <div className="App">
      {!isLogin ? (
        <div className="login">
          <div className="login_wrapper">
            <div className="name">名前を入力してください <input ref={nickname_ref} onKeyDown={handleLoginKeyClick}></input></div>
            <button onClick={handleLoginClick} className="enter_btn"></button>
          </div>
        </div>
      ) : (
        !currentRoom ? (
          <div className="room-list-container">
            <ChatRoomList 
              onJoinRoom={handleJoinRoom} 
              roomList={roomList} 
              onCreateRoom={handleCreateRoom} 
              onDeleteRoom={handleDeleteRoom} 
              nickName={nickName} 
            />
          </div>
        ) : (
          <>
            <div className="chat-container">
              <div className="current-room-name">{currentRoom}</div>
              <button onClick={toggleSidebar} className="toggle-sidebar-btn">현재 접속자</button>
              {showSidebar && <Sidebar userList={userList} nickName={nickName} />}
              <button onClick={toggleRoomList} className="toggle-roomlist-btn">채팅방 목록</button>
              <ChatInterface currentRoom={currentRoom} nickName={nickName} userList={userList} messages={messages} onSendMessage={handleSendMessage} />
            </div>
            {showRoomList && (
              <div className="room-list-overlay">
                <ChatRoomList 
                  onJoinRoom={handleJoinRoom} 
                  roomList={roomList} 
                  onCreateRoom={handleCreateRoom} 
                  onDeleteRoom={handleDeleteRoom} 
                  nickName={nickName}
                />
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
export default App;
