import React, { useEffect, useRef } from 'react';
import { ChatState } from '../context/ChatProvider';
import { format } from 'timeago.js';

const IndividualChats = ({ messages }) => {
	const { user } = ChatState();
	const scroll = useRef();

	// Always scroll to last Message
	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);
	return (
		<div className='flex flex-col'>
			{messages &&
				messages.map((message) => (
					<div ref={scroll} key={message._id}>
						{message.sender._id === user.user._id ? (
							<div className='flex flex-col items-end -z-30'>
								<h2 className='bg-indigo-600 text-white float-right rounded-l-full rounded-br-full py-2 px-3 mx-5 mt-2 w-fit max-w-[300px] text-left'>
									{message.content}
								</h2>
								<p className='mr-5 pr-3 text-sm text-center text-gray-600'>
									{format(message.createdAt)}
								</p>
							</div>
						) : (
							<div className='flex flex-col items-start -z-30'>
								<h2 className='bg-orange-600 text-black float-left rounded-r-full rounded-bl-full py-2 px-3 mx-5 mt-2 w-fit max-w-[300px] text-left'>
									{message.content}
								</h2>
								<p className='ml-5 pl-3 text-sm text-center text-gray-600'>
									{format(message.createdAt)}
								</p>
							</div>
						)}
					</div>
				))}
		</div>
	);
};

export default IndividualChats;
