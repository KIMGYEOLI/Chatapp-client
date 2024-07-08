import React from "react";

const CustomDate = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}年 ${today.getMonth() + 1}月 ${today.getDate()}日`;
  
    return (
      <div className="date_box">
        {formattedDate}
      </div>
    );
  }
  
  export default CustomDate;