import { Avatar } from '@material-ui/core';
import React, {useEffect, useState } from 'react';
import db from '../../firebase';
import { Link } from 'react-router-dom';
import './SidebarChat.css';

const SidebarChat = ({addNewChat, id, name}) => {

    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState("");

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    useEffect(() => {
        if( id ) {
            db.collection('rooms')
                .doc(id)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) =>doc.data())));
        }
    }, [id]);

    const createChat = ( ) => {
        const roomName = prompt("please ebnter name for chat");

        if ( roomName ) {
            db.collection("rooms").add({
                name: roomName
            });
        }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className='sidebarChat' >
            <Avatar src={`https://avatars.dicebear.com/api/human/${name}.svg`} />
            <div className="sidebarChat__info">
                <h2>{name}</h2>
                <p>{messages[0]?.messages}</p>

            </div>            
            </div>
        </Link>
        
    ) : (
        <div onClick={createChat}  className='sidebarChat' >
            <h2>Add New Chat</h2>
        </div>
    )
}

export default SidebarChat;
