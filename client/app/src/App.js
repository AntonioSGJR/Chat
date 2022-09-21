import './App.css';
import io from "socket.io-client";
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:3001");

function App() 
{
  const [ message, setMessage ] = useState({
    username: window.sessionStorage.getItem("name"),
    room: "",
    actualRoom: "",
    message: "",
    othersUsername: "",
    messageReceived: "",
    userInOutMessage: "",
    socketsInRoom: [],
    userOut: "",
    newUser: ""
  });

  const renderUserInOut = (actionUser) => {
    const chatMessages = document.querySelector(".chatMessages");
    const userInOut = document.createElement("div");
    const userInOutMessage = document.createElement("p");
    userInOutMessage.className = "userInOutMessage";
    userInOut.className = "userInOut";
    userInOutMessage.innerHTML = `${actionUser}!!`;
    userInOut.append(userInOutMessage)
    chatMessages.append(userInOut);
    chatMessages.scrollTo(0, 1000000);
  }


  const deleteMyMessages = () => {
    document.querySelectorAll(".myMessage").forEach((element) => {
      element.remove();
    });
  }

  const deleteUsers = () => {
    document.querySelectorAll(".userDiv").forEach((element) => {
      element.remove();
    });
  }
    
  const deleteOthersMessages = () => {
    document.querySelectorAll(".othersMessage").forEach((element) => {
      element.remove();
    });
  }

  const deleteInOutMessage = () => {
    document.querySelectorAll(".userInOut").forEach((element) => {
      element.remove();
    });
  }

  const deleteUser = (user) => {
    let bool = true;
    document.querySelectorAll(".userDiv").forEach((element) => {
      const name = element.querySelector(".userName");
      if(!bool)
      {
        return;

      }
      else if(name.innerHTML.toString() === user.toString())
      {
        element.remove();
        bool = !bool;
      }
      console.log(`user: ${user}\n message.user: ${message.userOut}`);
    });
  }

  const deleteAllInfo = () => {
    deleteMyMessages();
    deleteOthersMessages();
    deleteUsers();
    deleteInOutMessage();
  }

  const renderUser = (user) => {
    const sideBarElements = document.querySelector(".sideBarElements");
    const userDiv = document.createElement("div");
    const userPicture = document.createElement("div");
    const userPictureP = document.createElement("p");
    const userName = document.createElement("p");
    userDiv.className = "userDiv";
    userPicture.className = "userPicture";
    userName.className = "userName";
    userPictureP.innerHTML = user.toString()[0].toUpperCase() || "A";
    userName.innerHTML = user || "Anonimo";
    userPicture.append(userPictureP);
    userDiv.append(userPicture);
    userDiv.append(userName);
    sideBarElements.append(userDiv);
  }

  const renderMyMessage = () => {
    const date = new Date();
    const chatMessages = document.querySelector(".chatMessages");
    const myMessage = document.createElement("div");
    const msg = document.createElement("p");
    const msgDate = document.createElement("p");
    myMessage.className = "myMessage";
    msg.className = "msg";
    msgDate.className = "msgDate";
    msg.innerHTML = `${message.message}`;
    msgDate.innerHTML = `${parseInt(date.getHours().toString().length) === 1 ? `0${date.getHours()}`: date.getHours()}:${parseInt(date.getMinutes().toString().length) === 1 ? `0${date.getMinutes()}`: date.getMinutes()} ${parseInt(date.getHours()) > 6 && parseInt(date.getHours()) < 12 ? "da manhã": parseInt(date.getHours()) > 12 && parseInt(date.getHours()) < 18 ? "da tarde": parseInt(date.getHours()) > 18 && parseInt(date.getHours()) < 23 ? "da noite" : "da madrugada"}`;
    myMessage.append(msg);
    myMessage.append(msgDate)
    chatMessages.append(myMessage);
    chatMessages.scrollTo(0, 1000000);
  }

  const renderOthersMessage = () => {
    const date = new Date();
    const chatMessages = document.querySelector(".chatMessages");
    const othersMessage = document.createElement("div");
    const othersMsgName = document.createElement("p");
    const othersMsg = document.createElement("p");
    const othersMsgDate = document.createElement("p");
    othersMessage.className = "othersMessage";
    othersMsgName.className = "othersMsgName";
    othersMsg.className = "othersMsg";
    othersMsgDate.className = "othersMsgDate";
    othersMsgName.innerHTML = `${message.othersUsername}` || "Anonimo";
    othersMsg.innerHTML = `${message.messageReceived}`;
    othersMsgDate.innerHTML = `${parseInt(date.getHours().toString().length) === 1 ? `0${date.getHours()}`: date.getHours()}:${parseInt(date.getMinutes().toString().length) === 1 ? `0${date.getMinutes()}`: date.getMinutes()} ${parseInt(date.getHours()) > 6 && parseInt(date.getHours()) < 12 ? "da manhã": parseInt(date.getHours()) > 12 && parseInt(date.getHours()) < 18 ? "da tarde": parseInt(date.getHours()) > 18 && parseInt(date.getHours()) < 23 ? "da noite" : "da madrugada"}`;
    othersMessage.append(othersMsgName);
    othersMessage.append(othersMsg);
    othersMessage.append(othersMsgDate);
    chatMessages.append(othersMessage);
    setMessage((message) => ({...message, messageReceived: "", othersUsername: ""}));
    chatMessages.scrollTo(0, 1000000);
  }
  
  const sendMessage = () => {
    socket.emit("send_message", { actualRoom: message.actualRoom, message: message.message, username: message.username});
    renderMyMessage();
  }

  const joinRoom = () => {
    if(message.room !== message.actualRoom)
    {
      socket.emit("join_room", { room: message.room, username: message.username, previousRoom: message.actualRoom });
      socket.emit("user_out", { username: message.username, action: "Saiu", room: message.actualRoom});
      deleteAllInfo();
      renderUser(message.username);
      setMessage((message) => ({...message, actualRoom: message.room}));
      console.log(message);
      socket.emit("user_in", { username: message.username, action: "Entrou", room: message.room });
    
    } 
     
  }

  useEffect(() => {

    socket.on("receive_message", (data) => {
      setMessage((message) => ({...message,othersUsername: data.username, messageReceived: data.message}));
    });

  }, [socket, message]);

  useEffect(() => {
    socket.on("new_user_in_room", (user) => {
      setMessage(message => ({...message, newUser: user}));
    });

    socket.on("sockets_in_room", (data) => {
      setMessage((message) => ({...message, socketsInRoom: data}));
    });

    socket.on("user_in_message", (data) => {
      setMessage((message) => ({...message, userInOutMessage: `${data.username} ${data.action}`}));
      
    });

    socket.on("user_out_message", (data) => {
      setMessage((message) => ({...message, userInOutMessage: `${data.username} ${data.action}`}));
    });

    socket.on("user_out", (data) => {
      setMessage((message) => ({...message, userOut: data}));
    });

  }, [socket]);

  useEffect(() => {
    message.newUser !== "" && renderUser(message.newUser);
  }, [message.newUser])

  useEffect(() => {
    
    message.messageReceived !== "" && message.othersUsername !== "" && renderOthersMessage();
  
  }, [message.messageReceived, message.othersUsername]);

  useEffect(() => {
    message.userInOutMessage !== "" && renderUserInOut(message.userInOutMessage);
  },[message.userInOutMessage]);

  useEffect(() => {
    parseInt(message.socketsInRoom.length) !== 0 && message.socketsInRoom.forEach((item) => {
      renderUser(item);
    }); 

  }, [message.socketsInRoom]);
  
  useEffect(() => {
    message.userOut !== "" && deleteUser(message.userOut);
    setMessage((message) => ({...message, userOut: ""}));
  }, [message.userOut]);

  
  return (
    <div className="App">
      <div className="sideBar">
        <div className='sideBarElements'>
          <form onSubmit={(event) => {
            event.preventDefault();
            joinRoom();
            document.querySelector(".sideBar form input").value = "";
          }}>
            <input
            placeholder='Type a room...'
            onChange={(event) => {
              setMessage((message) => ({...message, room: event.target.value}));
              console.log(message);
            }}
            />
          
            <button>Join</button>
          </form>
        </div>
      </div>

      <div className='chat'>
        <div className='chatInfo'>
          <h2><span>{message.actualRoom === "" ? "Entre em uma sala" : `Sala: ${message.actualRoom}`}</span></h2>
        </div>
        <div className='chatMessages'>
        </div>
        <form onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
          document.querySelector(".chat form input").value = "";
        }}>
          <input
          placeholder='Message...'
          required
          onChange={(event) => {
            setMessage((message) => ({...message, message: event.target.value}));
            console.log(message);
          }} 
          />
          <button >Send Message</button>
        </form>
        
      </div>
    </div>
  );
}

export default App;