import React from 'react';
import './Sidebar.css';

function Sidebar({ userList, nickName }) {
  return (
    <div className="sidebar">
      <div className='currentAccessPerson'>현재 접속자🐾</div>
      {userList.map((user, index) => (
        <div key={index} className={`user ${user.nickName === nickName ? 'current-user' : ''}`}>
          {user.nickName} {user.roomName ? `(${user.roomName})` : ''}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
