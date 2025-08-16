import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, MessageSquare as DmIcon, Send, Paperclip, Smile, MoreHorizontal, Search, Plus, Settings, MessageSquare, CornerDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockData = {
  streams: [
    { id: 'stream-1', name: 'Frontend Stream', unread: 3 },
    { id: 'stream-2', name: 'Launch Stream', unread: 0 },
    { id: 'stream-3', name: 'Project Phoenix', unread: 1 },
  ],
  dms: [
    { id: 'dm-1', name: 'Manager Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager', status: 'available' },
    { id: 'dm-2', name: 'Member Mary', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member', status: 'away' },
    { id: 'dm-3', name: 'Guest George', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest', status: 'offline' },
  ],
  messages: {
    'stream-1': [
      { id: 'msg-1', sender: 'Member Mary', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member', text: 'Has anyone seen the latest designs for the new landing page? I have some feedback.', time: '10:30 AM', replies: [
        { id: 'reply-1', sender: 'Admin User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', text: 'Just saw them, they look great!', time: '10:32 AM'},
      ]},
      { id: 'msg-2', sender: 'Admin User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', text: 'I\'ll push the new button component in a few minutes. /link task-123', time: '10:35 AM', replies: []},
    ],
    'dm-1': [
      { id: 'msg-3', sender: 'Manager Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager', text: 'Let\'s sync up about the Q3 report tomorrow morning.', time: 'Yesterday', replies: [] },
    ]
  }
};

const statusOptions = {
  available: { label: 'Available', color: 'bg-green-500' },
  away: { label: 'Away', color: 'bg-yellow-500' },
  dnd: { label: 'Do Not Disturb', color: 'bg-red-500' },
  offline: { label: 'Offline', color: 'bg-gray-500' },
};

export function MessagesView() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState({ type: 'stream', id: 'stream-1' });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userStatus, setUserStatus] = useState('available');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(mockData.messages[activeChat.id] || []);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const msg = {
      id: `msg-${Date.now()}`,
      sender: user.name,
      avatar: user.avatar,
      text: newMessage,
      time: format(new Date(), 'p'),
      replies: []
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const handleNotImplemented = () => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });

  const renderActiveChatTitle = () => {
    if (activeChat.type === 'stream') {
      const stream = mockData.streams.find(s => s.id === activeChat.id);
      return <><Hash className="w-5 h-5 mr-2 text-gray-400" />{stream?.name}</>;
    }
    const dm = mockData.dms.find(d => d.id === activeChat.id);
    return <>{dm?.name}</>;
  };
  
  const renderAvatar = (chat) => {
     if (chat.type === 'dm') {
        const dmUser = mockData.dms.find(d => d.id === chat.id);
        const status = statusOptions[dmUser.status];
        return (
            <div className="relative mr-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={dmUser.avatar} />
                    <AvatarFallback>{dmUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${status.color} ring-2 ring-slate-800`}/>
            </div>
        )
     }
     return <Hash className="w-5 h-5 mr-3 text-gray-400" />
  }

  return (
    <motion.div
      key="messages"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full"
    >
      <Card className="glass-card h-full flex bg-slate-900/70">
        <div className="w-[320px] border-r border-white/10 flex flex-col bg-slate-800/30 rounded-l-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Messages</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-sm">
                      <span className={`h-2 w-2 rounded-full ${statusOptions[userStatus].color}`} />
                      {statusOptions[userStatus].label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card text-white">
                  <DropdownMenuLabel>Set your status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(statusOptions).map(([key, {label, color}]) => (
                      <DropdownMenuItem key={key} onClick={() => setUserStatus(key)}>
                          <span className={`h-2 w-2 rounded-full ${color} mr-2`} />
                          <span>{label}</span>
                      </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
          <div className="p-4"><Input placeholder="Search..." className="bg-slate-900/70 border-slate-700" /></div>
          
          <div className="flex-1 overflow-y-auto px-2">
            <div className="px-2 mb-2">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-400 uppercase">
                    <span>Streams</span>
                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleNotImplemented}><Plus/></Button>
                </div>
                {mockData.streams.map(stream => (
                    <div key={stream.id} onClick={() => setActiveChat({ type: 'stream', id: stream.id })} className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-white/10 ${activeChat.id === stream.id ? 'bg-purple-500/20' : ''}`}>
                       <div className="flex items-center">
                         <Hash className="w-4 h-4 mr-2 text-gray-500"/>
                         <span className="text-sm font-medium text-white">{stream.name}</span>
                       </div>
                       {stream.unread > 0 && <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stream.unread}</span>}
                    </div>
                ))}
            </div>

            <div className="px-2 mt-4">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-400 uppercase">
                    <span>Direct Messages</span>
                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleNotImplemented}><Plus/></Button>
                </div>
                 {mockData.dms.map(dm => (
                    <div key={dm.id} onClick={() => setActiveChat({ type: 'dm', id: dm.id })} className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-white/10 ${activeChat.id === dm.id ? 'bg-purple-500/20' : ''}`}>
                        {renderAvatar({type: 'dm', id: dm.id})}
                        <span className="text-sm font-medium text-white">{dm.name}</span>
                    </div>
                 ))}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <CardHeader className="flex-row items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              {activeChat.type === 'dm' ? <Avatar className="w-10 h-10 mr-3"><AvatarImage src={mockData.dms.find(d => d.id === activeChat.id)?.avatar} /></Avatar> : <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center mr-3"><Hash className="w-5 h-5 text-gray-400"/></div>}
              <CardTitle className="text-white">{renderActiveChatTitle()}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleNotImplemented}><Settings className="w-5 h-5"/></Button>
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
             <AnimatePresence>
                {messages.length > 0 ? messages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y:10}} animate={{ opacity: 1, y: 0}} className="flex items-start gap-3 group">
                     <Avatar className="w-10 h-10"><AvatarImage src={msg.avatar} /><AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback></Avatar>
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{msg.sender}</span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-gray-300">{msg.text}</p>
                        {msg.replies && msg.replies.length > 0 && (
                             <div className="text-sm text-blue-400 mt-1 cursor-pointer" onClick={handleNotImplemented}>
                                 {msg.replies.length} {msg.replies.length > 1 ? 'replies' : 'reply'}
                             </div>
                        )}
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 rounded-md p-1 flex gap-1">
                             <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleNotImplemented}><Smile className="w-4 h-4" /></Button>
                             <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleNotImplemented}><CornerDownRight className="w-4 h-4" /></Button>
                             <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleNotImplemented}><MoreHorizontal className="w-4 h-4" /></Button>
                        </div>
                     </div>
                  </motion.div>
                )) : (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageSquare className="w-16 h-16 mb-4" />
                    <h2 className="text-xl font-semibold">No messages yet</h2>
                    <p>Start the conversation!</p>
                  </motion.div>
                )}
             </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t border-white/10 mx-6 mb-4 bg-slate-800/50 rounded-lg">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={handleNotImplemented}><Paperclip className="w-5 h-5 text-gray-400" /></Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${renderActiveChatTitle()}`}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
              />
              <Button type="button" variant="ghost" size="icon" onClick={handleNotImplemented}><Smile className="w-5 h-5 text-gray-400" /></Button>
              <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700">
                <Send className="w-5 h-5 text-white" />
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}