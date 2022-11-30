import React from 'react';
import { Navigate } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';

const Protected = ({ children }) => {
	const user = ChatState();
	if (!user) {
		return <Navigate to={'/'} />;
	} else {
		return children;
	}
};

export default Protected;
