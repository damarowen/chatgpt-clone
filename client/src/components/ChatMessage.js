
import Avatar from "./Avatar";

const ChatMessage = ({ message }) => {

    const isGptUser = message.user === "gpt";
  return (
    <div className={`chat-message ${isGptUser ? "chatgpt" : "user"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${isGptUser ? "chatgpt" : "user"}`}>
       < Avatar isGptUser={isGptUser}/>
        </div>
        <div className="message"> {message.message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
