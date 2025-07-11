import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, MoreVertical, Send } from 'lucide-react';

const initialChats = [
  {
    id: 1,
    name: 'Aman Kumar',
    lastMessage: 'What\'s up? How are you doing today?',
    time: '10:24 AM',
    unreadCount: 3,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    lastMessage: 'Haha 😂 That was so funny!',
    time: 'Yesterday',
    unreadCount: 0,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    id: 3,
    name: 'Stranger #314',
    lastMessage: 'Let\'s connect again soon 💕',
    time: 'Monday',
    unreadCount: 1,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    id: 4,
    name: 'Rahul Singh',
    lastMessage: 'Nice talking to you!',
    time: 'Tuesday',
    unreadCount: 2,
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
];

type Chat = typeof initialChats[number];

const ChatPageWrapper = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>(initialChats);

  if (selectedChat) {
    return (
      <PersonalChat
        chat={selectedChat}
        onBack={() => setSelectedChat(null)}
        setChats={setChats}
      />
    );
  }

  return <ChatPageContent onChatClick={setSelectedChat} chats={chats} setChats={setChats} />;
};

const PersonalChat = ({
  chat,
  onBack,
  setChats,
}: {
  chat: Chat;
  onBack: () => void;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}) => {
  const [messages, setMessages] = useState([
    { fromMe: false, text: chat.lastMessage, time: chat.time },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setMessages([{ fromMe: false, text: chat.lastMessage, time: chat.time }]);
    // Mark chat as read
    setChats(prev =>
      prev.map(c => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  }, [chat, setChats]);

  const handleSend = () => {
    if (input.trim()) {
      const newMsg = {
        fromMe: true,
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newMsg]);
      setInput('');

      const updatedChat = {
        ...chat,
        lastMessage: input,
        time: newMsg.time,
        unreadCount: 0,
      };
      setChats(prev =>
        prev.map(c => (c.id === chat.id ? updatedChat : c))
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-gradient-to-br from-rose-50 to-pink-100 shadow-xl overflow-hidden flex flex-col">
      {/* Enhanced Header */}
      <div className="p-4 bg-gradient-to-r from-rose-500 to-pink-600 flex items-center shadow-lg">
        <button 
          onClick={onBack} 
          className="mr-3 text-white hover:scale-110 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <img 
          src={chat.avatar} 
          alt={`${chat.name} avatar`} 
          className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white shadow-md" 
        />
        <div className="flex-1">
          <span className="font-bold text-white text-lg block">{chat.name}</span>
          <span className="text-rose-100 text-xs">Online</span>
        </div>
        <button className="text-white hover:scale-110 transition-transform">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-rose-50 to-pink-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-xs shadow-md ${
                msg.fromMe
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white text-gray-800 border border-rose-200'
              }`}
            >
              <div className="leading-relaxed">{msg.text}</div>
              <div className={`text-xs text-right mt-1 ${msg.fromMe ? 'text-rose-100' : 'text-gray-400'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Input */}
      <div className="p-4 bg-white flex items-center border-t border-rose-100 shadow-lg">
        <input
          className="flex-1 px-4 py-3 rounded-full border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          className="ml-3 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

const ChatPageContent = ({
  onChatClick,
  chats,
  setChats,
}: {
  onChatClick: (chat: Chat) => void;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}) => {
  const [search, setSearch] = useState('');
  const [longPressedChatId, setLongPressedChatId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleLongPress = (chatId: number) => {
    setLongPressedChatId(chatId);
  };

  const handleDelete = (chatId: number) => {
    setLongPressedChatId(null);
    setChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="max-w-md mx-auto h-screen bg-white shadow-xl overflow-hidden flex flex-col">
      {/* Enhanced Header */}
      <div className="p-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')} 
              className="mr-3 hover:scale-110 transition-transform"
              aria-label="Go to home"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Chats</h1>
          </div>
          {totalUnreadCount > 0 && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-semibold">{totalUnreadCount} new</span>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2 bg-gradient-to-b from-rose-50 to-white">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats..."
          className="w-full px-4 py-3 rounded-full border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white shadow-sm"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center p-4 hover:bg-rose-50 cursor-pointer relative border-b border-rose-100 transition-colors duration-200"
              onClick={() => {
                if (longPressedChatId !== chat.id) onChatClick(chat);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(chat.id);
              }}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={`${chat.name} avatar`}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-200 shadow-sm"
                />
                {chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                  </div>
                )}
              </div>

              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h2 className={`font-semibold text-gray-800 truncate ${chat.unreadCount > 0 ? 'text-rose-700' : ''}`}>
                    {chat.name}
                  </h2>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-600'}`}>
                  {chat.lastMessage}
                </p>
              </div>

              {longPressedChatId === chat.id && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(chat.id);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => {
                      e.stopPropagation();
                      setLongPressedChatId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-8">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No chats found</h3>
            <p className="text-gray-500">Start a conversation to see your chats here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPageWrapper;