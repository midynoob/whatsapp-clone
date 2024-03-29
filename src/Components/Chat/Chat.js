import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, DvrTwoTone, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@material-ui/icons';
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import db from '../../firebase';
import { useStateValue } from '../../StateProvider';
import './Chat.css';
import firebase from 'firebase';

const Chat = () => {

    const [seed, setSeed] = useState("");
    const [input, setInput] = useState('');
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user} , dispatch] = useStateValue();

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    useEffect(() => {
        
        if(roomId) {
            db.collection('rooms')
                .doc(roomId)
                .onSnapshot(snapshot => {
                    setRoomName(snapshot.data().name)
                })

            db.collection('rooms').doc(roomId).collection("messages").orderBy('timestamp', 'asc').onSnapshot(snapshot => (
                setMessages(snapshot.docs.map(doc => doc.data()))
            ))
        }
        
        
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        console.log(input);
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput('');
    }

    return (
        <div className='chat' >
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${roomName}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen{" "}{new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map ((message, idx) => (
                    <p className={`chat__message ${message.name === user.displayName && 'chat__reciever'}`} key={idx}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">{new Date(message.timestamp?.toDate()).toUTCString().slice(17,22)}</span>
                    </p>
                ))}
            </div>
                

            <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input 
                        value={input}
                        onChange={(e) => {setInput(e.target.value)}}
                        type="text" 
                        placeholder="Type a message" 
                    />
                    <button type="submit" onClick={sendMessage}>Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat;
