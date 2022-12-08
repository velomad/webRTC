import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

import { socket } from "../../socket";
import Button from "../Button";

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const Chat = ({ socketID, currentMessage }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const userID = localStorage.getItem("userID");
  const messagesEndRef = useRef(null);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [chat]);

  useEffect(() => {
    socket.on("message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
  }, []);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socketID) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing");
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 2000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength) {
        socket.emit("stopTyping");
        setTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = () => {
    setShowEmojiPicker(false);
    socket.emit("stopTyping");
    socket.emit("message", {
      fromUser: userID,
      timeStamp: new Date(),
      toUser: "",
      message,
    });

    setMessage("");
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };
  return (
    <div className="rounded-xl w-full w-full bg-gray-200  ">
      <div className="flex flex-col justify-between">
        <div className="p-4 bg-blue-900 m-2 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="rounded-full h-12 w-12 bg-blue-800 flex justify-center items-center">
              <div className="text-white">D</div>
            </div>
            <div>
              <div className="text-white">Dr. Rupesh</div>
              {isTyping ? (
                <div className="text-xs text-white">Typing...</div>
              ) : null}
            </div>
          </div>
        </div>
        <div
          className="space-y-2 p-4 overflow-y-auto"
          style={{ height: "calc(100vh - 25vh)" }}
        >
          {chat.map((el, idx) => {
            const self = localStorage.getItem("userID") == el?.fromUser;

            return !self ? (
              <div ref={messagesEndRef} key={idx} className="flex ">
                <div className="flex items-center space-x-2 rounded-xl bg-gray-300 p-4">
                  <div className="bg-red-600 text-white text-lg rounded-full h-8 w-8 flex items-center justify-center">
                    S
                  </div>
                  <div>
                    <div className="text-lg">{el.message}</div>
                    <div className="float-right" style={{ fontSize: "10px" }}>
                      {formatAMPM(new Date(el.timeStamp))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={idx} className="flex justify-end">
                <div className="flex items-center space-x-2 rounded-xl bg-gray-300 p-4">
                  <div>
                    <div className="text-lg">{el.message}</div>
                    <div className="float-right" style={{ fontSize: "10px" }}>
                      {formatAMPM(new Date(el.timeStamp))}
                    </div>
                  </div>
                  <div className="bg-blue-600 text-white text-lg rounded-full h-8 w-8 flex items-center justify-center">
                    M
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex p-2 space-x-2 jutify-between">
          <div className="relative w-full">
            <textarea
              placeholder="Type your message here..."
              className="  bg-white rounded-xl p-4 w-full focus:outline-none"
              id="messageArea"
              onChange={(e) => handleTyping(e)}
              value={message}
              onKeyUp={handleKeyUp}
              rows={1}
              onBlur={() => setShowEmojiPicker(false)}
              draggable={false}
            />
            <div
              className="absolute right-3 top-3"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-gray-400 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
            </div>
            <div
              className={`absolute bottom-16 right-0 ${
                showEmojiPicker ? "block" : "hidden"
              }`}
            >
              <EmojiPicker
                lazyLoadEmojis={true}
                onEmojiClick={({ emoji }) =>
                  setMessage((prevMsgs) => {
                    const msg = prevMsgs + " " + emoji;
                    return msg;
                  })
                }
              />
            </div>
          </div>
          <Button classes="rounded-xl" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
