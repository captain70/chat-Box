import SearchSlider from '../components/SearchSlider';
import { ChatState } from '../context/ChatProvider';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import { useState } from 'react';

const Chat = () => {
	const { user } = ChatState();
	const [fetchAgain, setFetchAgain] = useState(false);

	return (
		<div className='w-full bg-[#fcfbf7]'>
			{user && <SearchSlider />}
			<div className='flex justify-between w-[100%] h-[91.5vh] p-3'>
				{user && <ChatList fetchAgain={fetchAgain} />}
				{user && (
					<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</div>
		</div>
	);
};

export default Chat;
