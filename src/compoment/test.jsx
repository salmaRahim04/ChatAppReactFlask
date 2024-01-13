
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import ChatInterface from "./Interfacechat.jsx";
import Navbar from "./Header.jsx";

function Test() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

      const socket = io("http://127.0.0.1:5001", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:5173/",
        },
      });

      setSocketInstance(socket);

      socket.on("connect", (data) => {
        console.log(data);
      });


      setLoading(false);

      socket.on("disconnect", (data) => {
        console.log(data);
      });

      return function cleanup() {
        socket.disconnect();
      
    }
  }, []);

  return (
    <div className="App">
      <Navbar/>
          <div className="line">
            {!loading && <ChatInterface socket={socketInstance} />}
          </div>

    </div>
  );
}

export default Test;