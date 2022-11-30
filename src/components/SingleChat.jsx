import React, { useState, useEffect } from 'react';
import { ChatState } from '../context/ChatProvider';
import { BiArrowBack } from 'react-icons/bi';
import { getSender, getSenderFull, getStatus } from '../config/ChatLogics';
import ProfileModal from './ProfileModal';
import { IoSendSharp } from 'react-icons/io5';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IndividualChats from './IndividualChats';
import io from 'socket.io-client';
import { useRef } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';

const ENDPOINT = process.env.REACT_APP_API;
var selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const { user, selectedChat, notification, setNotification } = ChatState();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState('');
	// eslint-disable-next-line
	const [socketConnection, setSocketConnection] = useState(false);
	const [activeUsers, setActiveUsers] = useState([]);

	const socket = useRef();
	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.user.token}`,
				},
			};

			setLoading(true);

			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`,
				config
			);

			setMessages(data);
			setLoading(false);
			socket.current.emit('join-chat', selectedChat._id);
		} catch (error) {
			toast.error('Error loading message', {
				position: toast.POSITION.TOP_LEFT,
			});
		}
	};
	const sendMessage = async (e) => {
		e.preventDefault();
		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${user.user.token}`,
				},
			};
			setNewMessage('');
			const { data } = await axios.post(
				'/api/message',
				{
					content: newMessage,
					chatId: selectedChat._id,
				},
				config
			);

			socket.current.emit('new-message', data);

			setMessages([...messages, data]);
		} catch (error) {
			toast.error('Error Sending Message', {
				position: toast.POSITION.TOP_LEFT,
			});
		}
	};
	useEffect(() => {
		socket.current = io(ENDPOINT);
		socket.current.emit('start', user.user);
		socket.current.on(
			'connected',
			(users) => setActiveUsers(users),
			setSocketConnection(true)
		);

		// eslint-disable-next-line
	}, [user]);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChat]);

	useEffect(() => {
		socket.current.on('message-recieved', (newMessageRecieved) => {
			if (
				// if chat is not selected or doesn't match current chat
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				// set notification
				if (!notification.includes(newMessageRecieved)) {
					setNotification([newMessageRecieved, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	});
	const checkOnlineUsers = (selectedChat) => {
		const chatMember = selectedChat.users.find(
			(chatUser) => chatUser._id !== user.user._id
		);
		const online = activeUsers.find((user) => user.userId === chatMember._id);

		return online ? true : false;
	};

	return (
		<>
			{selectedChat ? (
				<div className='w-full'>
					<div className='flex justify-between items-center w-[100%] py-3 bg-[#f1eee3] rounded-md'>
						<button
							className='flex md:hidden bg-gray-300 p-2 rounded-lg'
							onClick={() => selectedChat('')}
						>
							<BiArrowBack />
						</button>
						{checkOnlineUsers(selectedChat) ? (
							<div className='text-green-400 hidden md:flex space-x-1 justify-center items-center md:ml-5 text-lg'>
								<GoPrimitiveDot />
								<p>{getStatus(user.user, selectedChat.users)}</p>
							</div>
						) : (
							<div className='text-red-600 hidden md:flex space-x-1 justify-center items-center md:ml-5 text-lg tracking-wide'>
								<GoPrimitiveDot />
								<p>offline</p>
							</div>
						)}

						<h2 className='uppercase text-lg text-[#0487f2] tracking-widest'>
							{getSender(user.user, selectedChat.users)}
						</h2>
						<button className='bg-gray-300 p-2 rounded-lg md:mr-5'>
							<ProfileModal
								user={getSenderFull(user.user, selectedChat.users)}
							/>
						</button>
					</div>
					<div className='flex flex-col justify-end p-3 bg-white/70 w-[100%] h-[72vh] max-h-[75vh] overflow-auto'>
						{loading ? (
							<div className='flex items-center justify-center my-auto'>
								<div
									className='animate-spin  w-10 h-10 border-[3px] border-current border-t-transparent text-cyan-600 rounded-full  mt-6 inline-block '
									role='status'
									aria-label='loading'
								>
									<span className='sr-only'>Loading...</span>
								</div>
							</div>
						) : (
							<div className='flex flex-col overflow-auto no-scrollbar'>
								<IndividualChats messages={messages} />
							</div>
						)}
					</div>
					<form
						className='w-full flex justify-center items-center bg-[#f1eee3] rounded-lg'
						onSubmit={sendMessage}
					>
						{/* {isTyping ? <div>loading...</div> : <></>} */}

						<div className='w-full'>
							<input
								onChange={(e) => setNewMessage(e.target.value)}
								value={newMessage}
								type='text'
								placeholder='Send a message'
								className=' text-lg text-gray-800 placeholder-gray-500 placeholder:italic w-full rounded-lg py-3 pr-4 pl-12 bg-[#f1eee3] bg-opacity-75 outline-none transition-all'
							/>
						</div>
						<button
							type='submit'
							className='bg-cyan-500 p-4 text-white rounded-r'
						>
							<IoSendSharp size={23} />
						</button>
					</form>
					<ToastContainer />
				</div>
			) : (
				<h1 className='flex items-center justify-center  capitalize text-3xl text-gray-500 mt-40'>
					<BiArrowBack className='mx-2' />
					Click on a user to start a conversation
				</h1>
			)}
		</>
	);
};
export default SingleChat;
