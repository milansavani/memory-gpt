import React, { useEffect, useState, useRef } from 'react';
import { AppBar, IconButton, Toolbar, InputBase, Typography, Box, Avatar } from '@mui/material';
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
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 88px)',
    margin: 'auto'
  },
  contentContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '2vh 2vh 8vh',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  avatar: {
    width: '28px !important',
    height: '28px !important',
  },
  messageContainer: {
    display: 'flex'
  },
  message: {
    flex: 1,
    margin: '0 12px 24px'
  },
  senderName: {
    fontWeight: '600 !important',
    fontSize: '16px !important',
    lineHeight: '20px !important',
    marginBottom: '4px !important'
  },
  messageText: {},
  sender: {
    display: 'flex',
    border: '1px solid #ccc',
    margin: '20px 10px 20px',
    borderRadius: '16px',
  },
  senderButton: {
    display: 'flex',
    alignItems: 'flex-end !important',
    '& .MuiButtonBase-root': {
      marginBottom: '6px'
    }
  },
  inputBase: {
    flex: 1,
    padding: '0 !important',
    '& .MuiInputBase-inputMultiline': {
      height: '24px',
      lineHeight: '24px',
      padding: '14px',
      maxHeight: '30vh',
      overflow: 'auto !important',
    },
    '& .MuiInputBase-inputMultiline::-webkit-scrollbar': {
      display: 'none'
    }
  }
}));

const App = () => {
  
  const initialized = useRef(false);
  const classes = useStyles();
  const [inputData, setInputData] = useState('');
  const [messages, setMessages] = useState([
    { type: 'output', data: 'Hi, How Can I help you?' }
  ]);
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
    console.log('Milan',process.env.REACT_APP_WEBSOCKET_URL);
    const newSocket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}${userId}`);
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

  const Message = ({ message }) => {
    return (
      <Box className={classes.messageContainer}>
        <Avatar variant='rounded' alt={message.type} className={classes.avatar} src={message.type === 'input' ? '' : 'https://cdn-icons-png.flaticon.com/512/2068/2068998.png'} />
        <Box className={classes.message}>
          <Typography className={classes.senderName}>{message.type === 'output' ? 'Memory GPT Bot' : 'You'}</Typography>
          <Typography className={classes.messageText}>{message.data}</Typography>
        </Box>
      </Box>
    )
  };

  return (
    <Box className={classes.root}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar className={classes.appBar}>
          <Typography variant="h3" margin={2}>Memory GPT</Typography>
        </Toolbar>
      </AppBar>

      <Box maxWidth="md" width="100%" className={classes.wrapper}>
        <Box className={classes.contentContainer}>
          {
            messages.map((message) => <Message message={message} />)
          }
        </Box>
        {/* Message Sender */}
        <Box className={classes.sender}>
          <Box flex={1}>
            <InputBase
              placeholder="Type your message..."
              className={classes.inputBase}
              multiline
              rowsMax={4}
              fullWidth
              onChange={handleInputChange}
              value={inputData}
            />
          </Box>
          <Box className={classes.senderButton}>
            <IconButton color="primary" aria-label="send" onClick={sendDataToServer} disabled={!inputData}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;