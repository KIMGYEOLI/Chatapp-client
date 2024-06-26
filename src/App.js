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

import React, { useEffect, useRef, useState } from "react";
import server from "./server";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(false); // 로그인 상태 저장
  const [nickName, setNickName] = useState(""); // 닉네임 저장
  const [msg, setMsg] = useState([]); // 메시지 리스트 저장

  const msg_ref = useRef(""); // 메시지 입력 필드 참조
  const nickname_ref = useRef(""); // 닉네임 입력 필드 참조
  const scroll_ref = useRef(null);  // 채팅 창 스크롤 참조

  function handleLoginClick() {
    if (nickname_ref.current && nickname_ref.current.value) {
      server.emit('login', nickname_ref.current.value);
      setIsLogin(true);
      setNickName(nickname_ref.current.value);
    }
  }

  function handleLoginKeyClick(e) {
    if (e.key === 'Enter') {
      handleLoginClick();
    }
  }

  function handleSendClick() {
    if (msg_ref.current.value !== "") {
      let msg_array = [...msg]
      msg_array.push({ level: "me", msg: msg_ref.current.value });
      setMsg(msg_array);
      server.emit('sendMessage', { nickName: nickName, msg: msg_ref.current.value });
      msg_ref.current.value = "";
    }
  }

  function handleSendKeyClick(e) {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  }

  useEffect(() => {
    const handleMessage = (data) => {
      setMsg(prevMsg => [...prevMsg, data]);
    };

    server.on('msg', handleMessage);

    return () => {
      server.off('msg', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (scroll_ref.current) {
      scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight;
    }
  }, [msg]);

  return (
    <div className="App">
      {!isLogin ?
        <div className="login">
          <div className="login_wrapper">
            <div className="name">名前を入力してください <input ref={nickname_ref} onKeyDown={handleLoginKeyClick}></input></div>
            <button onClick={handleLoginClick} className="enter_btn"></button>
          </div>
        </div>
        :
        <div className="chatting">
          <div className="chatting_wrapper">
            <div ref={scroll_ref} className='chatting_box'>
              {msg.map((c, index) => (
                <div key={index} className='msg_box'
                  style={{
                    justifyContent: c.level === "sys" ? "center" : c.level === "" ? "start" : "end"
                  }}>
                  <div className={c.level === "sys" ? 'msg_center' : "msg"}>{c.msg}</div>
                  {c.level !== "sys" && <div className='nickname_style'>{c.nickName}</div>}
                </div>
              ))}
            </div>
            

            <div className="input_box">
              <input ref={msg_ref} onKeyDown={handleSendKeyClick}></input>
              <div className="box"></div>
              <button onClick={handleSendClick}>send</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
