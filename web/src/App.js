import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);
  const [log, setLog] = useState(0);

  useEffect(() => {
    setLog(0);
  }, []);

  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on("login", (data) => {
      console.log(data);
      if (data === "logout") {
        console.log("logout입니다.");
        setLog(1);
        console.log(log);
      } else {
        console.log("login입니다.");
        setLog(0);
        console.log(log);
      }

      //   setChat([...chat, { name, message }]);
    });
  }, []);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    const { name, message } = state;
    socketRef.current.emit("message", { name, message });
    e.preventDefault();
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
        <div className="name-field">
          <TextField
            name="name"
            onChange={(e) => onTextChange(e)}
            value={state.name}
            label="Name"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={(e) => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
      <div>
        login singnal<button>logged</button>
        {log === 0 ? <h1>접속중인유저.</h1> : <h1>비접속중인유저</h1>}
      </div>
    </div>
  );
}

export default App;
