import "./App.css";
import "./normal.css";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Your component code goes here
import ChatMessage from "./components/ChatMessage";

function ShowErrorDialog(errorMessage) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: errorMessage,
    showCancelButton: true,
    confirmButtonText: 'Refresh',
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
}


function App() {
  // use effect run once when app loads
  useEffect(() => {
    getEngines();
  }, []);

  // add state for input and chat log
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("gpt-3.5-turbo");

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

  function getEngines() {
    fetch("http://localhost:3010/models")
      .then((res) => {
        if (!res.ok) {
          throw new Error("An error occurred while fetching the models.");
        }
        return res.json();
      })
      .then((data) => {
        setModels(data.data);
      })
      .catch((error) => {
        console.error(error);
        ShowErrorDialog(error);
        })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);

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
            <option value="">Choose</option>
            {models.map((model, index) => (
              <option key={index} value={model.id}>
                {model.id}{" "}
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
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
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
