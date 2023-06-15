import "./App.css";
import React, { useState,useRef, useEffect } from "react";

// Your component code goes here
import ChatMessage from "./components/ChatMessage";
import { GetEngines , ShowErrorDialog }from "./utils/Utils";
import Thinking from "./components/Thinking";



function App() {


  // add state for input and chat log
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("gpt-3.5-turbo");
  const inputRef = useRef();
  const messagesEndRef = useRef();
  const [thinking, setThinking] = useState(false);

    /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you today?",
    },
  ]);


  // clear chats
  function clearChat() {
    fetch("http://localhost:3010/clear")
      .then((res) => {
        setChatLog([
          {
            user: "gpt",
            message: "How can I help you today?",
          },
        ]);
        res.json();
      })
      .catch((error) => {
        console.error(error);
        ShowErrorDialog(error);
      });
  }


  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);
    setThinking(true);

    try {
      const response = await fetch("http://localhost:3010/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          currentModel,
        }),
      });

      if (!response.ok) {
        throw new Error("An error occurred while processing the request.");
      }

      const data = await response.json();

      setThinking(false);

      //append
      setChatLog([
        ...chatLogNew,
        { user: "gpt", message: `${data.message.content}` },
      ]);
    } catch (error) {
      console.error(error);
      ShowErrorDialog(error);
    }
  }


    /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

    /**
   * Focuses the TextArea input to when the component is first rendered.
   */
    useEffect(() => {
      inputRef.current.focus();
    }, []);
    
    // use effect run once when app loads
    useEffect(() => {
      GetEngines(setModels);
    }, []);

    
  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="sidemenu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="models">
          <select
            onChange={(e) => {
              setCurrentModel(e.target.value);
            }}
            style={{ width: "200px" }} // Set a fixed width for the select element
          >
            <option value="">Models</option>
            {models.map((model, index) => (
              <option key={index} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">

          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {thinking && <Thinking />}
          <span ref={messagesEndRef}></span>

        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
