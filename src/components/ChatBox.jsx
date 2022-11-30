import React from 'react';
import { ChatState } from '../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
	const { selectedChat } = ChatState();
	return (
		<div
			className={`${
				(selectedChat
					? 'flex flex-col items-center py-1 bg-[#f1eee3]  w-full rounded-lg'
					: 'hidden',
				'md:flex md:flex-col items-center py-1 bg-[#f1eee3] md:w-[65%] w-full rounded-lg')
			}`}
		>
			<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
		</div>
	);
};

export default ChatBox;
