import { Route, Routes } from 'react-router-dom';
import Protected from './components/Protected';
import ChatProvider from './context/ChatProvider';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';

function App() {
	return (
		<div>
			<ChatProvider>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='*' element={<NotFound />} />
					<Route
						path='/chat'
						element={
							<Protected>
								<Chat />
							</Protected>
						}
					/>
					<Route path='/login' element={<Login />} />
					<Route path='/signup' element={<SignUp />} />
				</Routes>
			</ChatProvider>
		</div>
	);
}

export default App;
