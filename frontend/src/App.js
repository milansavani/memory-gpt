import React, { useEffect, useState, useRef } from 'react';
import { AppBar, IconButton, Toolbar, InputBase, Typography, Grid, Divider, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  appBar: {
    flexGrow: 0,
    backgroundColor: 'black',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Center the content vertically
    flexGrow: 1,
    overflowY: 'auto',
    margin: '2vh 4vh',
  },
  content: {
    flexGrow: 1,
    maxWidth: 600, // Set a max width for the content if needed
    width: '100%',
  },
  sender: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    border: '1px solid #ccc',
    margin: '2vh 4vh',
    borderRadius: '16px',
  },
}));

const App = () => {
  
  const initialized = useRef(false);
  const classes = useStyles();
  const [inputData, setInputData] = useState('');
  const [messages, setMessages] = useState([{type: 'output', data: 'Hi, How Can I help you?'}]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    connectWS();
    // Disconnect the WebSocket when the component unmounts
    return () => {
      socket && socket.close();
    };
  }, [socket]);

  const connectWS = () => {
    const userId = Date.now();
    const newSocket = new WebSocket(`ws://localhost:4040/${userId}`);
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
    if (inputData && inputData.length > 0 && socket && socket.readyState === WebSocket.OPEN) {
      // Convert data to a JSON string before sending
      const jsonData = JSON.stringify({ inputData: inputData.trim() });
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
    <div className={classes.root}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar className={classes.appBar}>
          <Typography variant="h3" margin={2}>Memory GPT</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.contentContainer}>
        {messages.map((message, index) => (
          <div key={index} className={classes.content}>
            {message.type === 'input' && (
              <>
                <div className={classes.avatar}>
                  {/* Assuming each item in inputData has a profile image */}
                  <Avatar src='https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png' alt="Profile" />
                </div>
                <Typography variant="subtitle1">You</Typography>
                <Typography>{message.data}</Typography>
              </>
            )}
            {message.type === 'output' && (
              <>
                <div className={classes.avatar}>
                  {/* Assuming each item in inputData has a profile image */}
                  <Avatar src='https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png' alt="Profile" />
                </div>
                <Typography variant="subtitle1">ChatGPT</Typography>
                <Typography>{message.data}</Typography>
              </>
            )}
          </div>
        ))}
      </div>

      <Divider />
      {/* Message Sender */}
      <div className={classes.sender}>
      <Grid container alignItems="center" borderRadius={'16px'}>
        <Grid item xs={11}>
          <InputBase
              placeholder="Type your message..."
              className={classes.inputBase}
              multiline
              rowsMax={4}
              fullWidth
              onChange={handleInputChange}
              value={inputData}
          />
        </Grid>
        <Grid xs={1} align="right">
          <IconButton color="primary" aria-label="send" onClick={sendDataToServer}>
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
      </div>
    </div>
  );
};

//   return (
//     <div>
//       <h1>Real-Time Updates</h1>

//       <button onClick={connectWS}>Connect WS</button>
//       <button onClick={sendDataToServer}>Send Data to Server</button>
//       <input type="text" value={inputData} onChange={handleInputChange} />

//       {messages.map((message, index) => (
//           <div key={index}>
//             {message.type === 'input' && <p>{`You: ${message.data}`}</p>}
//             {message.type === 'output' && <p>{`${message.data}`}</p>}
//           </div>
//       ))}
      
//     </div>
//   );
// };

export default App;