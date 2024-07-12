import React, { useRef, useState, useEffect } from 'react';
import server from '../../server';
import CustomDate from '../CustomDate';

const ChatInterface = ({ currentRoom, nickName }) => {
  const [msg, setMsg] = useState([]);
  const [dateMsg, setDateMsg] = useState([]);

  const msg_ref = useRef("");
  const scroll_ref = useRef(null);

  const handleSendClick = () => {
    const message = msg_ref.current.value;
    if (message !== "") {
      console.log("Sending message: ", message);
      // 클라이언트에서 자신이 보낸 메시지 추가 (level: "me")
      setMsg(prevMsg => [...prevMsg, { level: "me", msg: message, nickName: nickName }]);
      // 서버로 메시지 전송
      server.emit('sendMessage', { roomName: currentRoom, nickName: nickName, msg: message });
      msg_ref.current.value = "";
    }
  };

  const handleSendKeyClick = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.level === "date") {
        setDateMsg(data.msg);
      } else {
        // 자신의 메시지는 이미 처리했으므로 다른 사용자의 메시지만 추가 (level: "other")
        if (data.nickName !== nickName) {
          console.log("Received message:", data);
          setMsg(prevMsg => [...prevMsg, data]);
        }
      }
    };

    server.on('msg', handleMessage);

    return () => {
      server.off('msg', handleMessage);
    };
  }, [currentRoom, nickName]);

  useEffect(() => {
    console.log("Updated messages:", msg);
    if (scroll_ref.current) {
      scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight;
    }
  }, [msg, dateMsg]);

  const linkify = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.split(urlPattern).map((part, index) =>
      urlPattern.test(part) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a> : part
    );
  };

  return (
    <div className="chat-container">
      <div className="chatting">
        <div className="chatting_wrapper">
          <div ref={scroll_ref} className='chatting_box'>
            <div><CustomDate /></div>
            {msg.map((c, index) => (
              <div key={index} className='msg_box'
                style={{
                  justifyContent: c.level === "sys" ? "center" : c.level === "me" ? "flex-end" : "flex-start"
                }}>
                {c.level !== "sys" && c.level !== 'me' && <img src="/몰티즈5.png" alt="" className="avatar" />}
                <div className={c.level === "sys" ? 'msg_center' : c.level === "me" ? "msg_me" : "msg_other"}>
                  {linkify(c.msg)}
                </div>
                {c.level !== "sys" && c.level !== 'me' && <div className='nickname_style'>{c.nickName}</div>}
              </div>
            ))}
          </div>
          <div className="input_box">
            <input ref={msg_ref} onKeyDown={handleSendKeyClick}></input>
            <div className="box"></div>
            <button onClick={handleSendClick}></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;