import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import { getSender } from '../config/ChatLogics';
import { chatRoute } from '../utils/ApiRoutes';

const ChatList = ({ fetchAgain }) => {
	const [loggedUser, setLoggedUser] = useState();

	const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.user.token}`,
				},
			};

			const { data } = await axios.get(chatRoute, config);

			setChats(data);
		} catch (error) {
			toast.error('Error Fetching Chats', {
				position: toast.POSITION.TOP_LEFT,
			});
		}
	};

	useEffect(() => {
		setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
		fetchChats();
		// eslint-disable-next-line
	}, [fetchAgain]);

	return (
		<>
			<div
				className={`${
					(selectedChat
						? 'hidden'
						: 'flex flex-col items-center p-1 bg-[#f1eee3]  w-[100%] rounded-lg',
					'md:flex md:flex-col items-center p-1 bg-[#f1eee3] md:w-[33%] w-[100%] rounded-lg')
				}`}
			>
				<h1 className='flex items-center justify-center w-full px-1 py-4 text-2xl text-center tracking-widest text-[#0487f2]'>
					My Chat
				</h1>
				<div className='w-full'>
					{chats ? (
						<div className='flex flex-col gap-y-2 mt-2'>
							{chats?.map((chat) => (
								<div
									key={chat._id}
									onClick={() => setSelectedChat(chat)}
									className='cursor-pointer px-2 py-3 w-full  rounded-lg  max-w-[75%] overflow-auto bg-cyan-500 text-white active:bg-cyan-800 mx-auto focus:ring-2 focus:ring-white'
								>
									<h2 className='capitalize text-lg text-indigo-600'>
										{getSender(loggedUser.user, chat.users)}
									</h2>
									{chat.latestMessage && (
										<p className='text-sm'>
											<b className='text-gray-300'>
												{chat.latestMessage.sender.name} :{' '}
											</b>
											{chat.latestMessage.content.length > 50
												? chat.latestMessage.content.substring(0, 51) + '...'
												: chat.latestMessage.content}
										</p>
									)}
								</div>
							))}
						</div>
					) : (
						<div className='flex items-center justify-center'>
							<div
								className='animate-spin  w-5 h-5 border-[3px] border-current border-t-transparent text-cyan-600 rounded-full  mt-6 inline-block '
								role='status'
								aria-label='loading'
							>
								<span className='sr-only'>Loading...</span>
							</div>
						</div>
					)}
				</div>

				<ToastContainer />
			</div>
		</>
		// {chats ? (
		//   <Stack overflowY="scroll">
		//     {chats.map((chat) => (
		//       <Box
		//         onClick={() => setSelectedChat(chat)}
		//         cursor="pointer"
		//         bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
		//         color={selectedChat === chat ? "white" : "black"}
		//         px={3}
		//         py={2}
		//         borderRadius="lg"
		//         key={chat._id}
		//       >
		//         <Text>
		//           {!chat.isGroupChat
		//             ? getSender(loggedUser, chat.users)
		//             : chat.chatName}
		//         </Text>
		//         {chat.latestMessage && (
		//           <Text fontSize="xs">
		//             <b>{chat.latestMessage.sender.name} : </b>
		//             {chat.latestMessage.content.length > 50
		//               ? chat.latestMessage.content.substring(0, 51) + "..."
		//               : chat.latestMessage.content}
		//           </Text>
		//         )}
		//       </Box>
		//     ))}
		//   </Stack>
		// ) : (
		//   <ChatLoading />
		// )}
	);
};

export default ChatList;
