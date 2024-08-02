import { createContext, useContext, useEffect, useState } from "react"; // here i importing the createcontext
import { useNavigate } from "react-router-dom";

const ChatContext = createContext(); // here i refer the instance the ChatContext()

const ChatProvider = ({ children }) => {
  // here ChatProvider is the Components :)

  const [user, setuser] = useState();
  const [selectedchat, setselectedchat] = useState();
  const [chat, setchat] = useState([]);
  const [notification, setnotification] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setuser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setuser,
        selectedchat,
        setselectedchat,
        chat,
        setchat,
        notification,
        setnotification,
      }}
    >
      {" "}
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
