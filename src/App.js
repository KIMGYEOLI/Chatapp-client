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
    if (currentRoom === roomName) {
      alert("이미 입장되어 있습니다.");
      return;
    }
    console.log(`Join room: ${roomName}`);
    if (currentRoom) {
      server.emit('leaveRoom', { roomName: currentRoom, nickName });
    }
    setCurrentRoom(roomName);
    setMessages([]);
    server.emit('joinRoom', { roomName, nickName });
  };

  const handleCreateRoom = (roomName) => {
    setRoomList([...roomList, { roomName, createdBy: nickName }]);
    server.emit('createRoom', { roomName, createdBy: nickName });
  };

  const handleDeleteRoom = ({ roomName, requestedBy }) => {
    if(window.confirm("정말로 삭제하시겠습니까?")) {
      const roomToDelete = roomList.find(room => room.roomName === roomName);
    if (roomToDelete && roomToDelete.createdBy === requestedBy) {
      setRoomList(roomList.filter(room => room.roomName !== roomName));
      server.emit('deleteRoom', { roomName, requestedBy });
    } else {
      alert("방을 삭제할 권한이 없습니다.");
    }
    };
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
      setMessages([]);
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
      setShowRoomList(false);
      setMessages([]);
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
