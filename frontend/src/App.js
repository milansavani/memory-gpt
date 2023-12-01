import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [inputData, setInputData] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Disconnect the WebSocket when the component unmounts
    return () => {
      socket && socket.close();
    };
  }, []);

  const connectWS = () => {
    const newSocket = new WebSocket('ws://localhost:4040');
    setSocket(newSocket);

    newSocket.addEventListener('message', (event) => {
      const { data } = JSON.parse(event.data);
      data && !data.isEmpty && setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'output', data },
      ]);
    });
  }

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const sendDataToServer = () => {
    // Check if the WebSocket is open before sending data
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Convert data to a JSON string before sending
      const jsonData = JSON.stringify({ inputData });
      socket.send(jsonData);

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'input', data: inputData },
      ]);

      // Clear the input field
      setInputData('');
    }
  };

  return (
    <div>
      <h1>Real-Time Updates</h1>

      <button onClick={connectWS}>Connect WS</button>
      <button onClick={sendDataToServer}>Send Data to Server</button>
      <input type="text" value={inputData} onChange={handleInputChange} />

      {messages.map((message, index) => (
          <div key={index}>
            {message.type === 'input' && <p>{`You: ${message.data}`}</p>}
            {message.type === 'output' && <p>{`${message.data}`}</p>}
          </div>
      ))}
      
    </div>
  );
};

export default App;