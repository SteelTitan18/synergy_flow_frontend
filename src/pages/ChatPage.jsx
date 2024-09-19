import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import Banner from "../components/Banner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useGetProjectDetailsQuery,
  useGetProjectMessagesQuery,
} from "../redux/features/api/apiSlice";
import { requestHasFailed } from "../functions/api/functions";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";

export default function Chat() {
  const project_id = useParams().project_id;
  const [project, setProject] = useState({});
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.user);

  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  let { data: project_fetched, isLoading: isProjectLoading } =
    useGetProjectDetailsQuery(project_id);
  let { data: messages_fetched, isLoading: isMessagesLoading } =
    useGetProjectMessagesQuery(project_id);

  useEffect(() => {
    if (!isProjectLoading) {
      if (!requestHasFailed(project_fetched, navigate)) {
        setProject(project_fetched);
      }
    }
  }, [isProjectLoading, project_fetched]);
  useEffect(() => {
    if (!isMessagesLoading) {
      if (!requestHasFailed(messages_fetched, navigate)) {
        setMessages([...messages_fetched?.results]);
      }
    }
  }, [isMessagesLoading, messages_fetched]);

  useEffect(() => {
    // Get the username from local storage or prompt the user to enter it
    setUsername(currentUser.username);

    // Connect to the WebSocket server with the username as a query parameter
    const newSocket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${project_id}/`
    );
    setSocket(newSocket);

    newSocket.onopen = () => console.log("WebSocket connected");
    newSocket.onclose = () => console.log("WebSocket disconnected");

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, [username]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };
    }
  }, [socket]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message && socket) {
      const data = {
        content: message,
        sender: username,
        message_project: project_id,
      };
      socket.send(JSON.stringify(data));
      setMessage("");
    }
  };

  const messages_items = messages.map((message) => (
    <Message
      model={{
        message: message.content,
        sentTime: message.moment,
        sender: message.sender,
      }}
    />
  ));

  if (isProjectLoading || isMessagesLoading) return <Loader />;

  return (
    <div className="page-layout">
      <Banner title={`${project.label} : espace de discussions`} />
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="card mt-5">
            <div className="font-bold">{message.sender}</div>
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">{message.moment}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-5 mt-10">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button type="submit" className="button">
          Envoyer
        </Button>
      </form>
    </div>
  );
}
