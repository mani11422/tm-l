import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast({
        title: "🤖 AI Assistant Activated!",
        description: "This feature isn't fully implemented yet, but you can request it next!",
      });
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1,
          }}
        >
          <Button
            onClick={handleToggle}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg animate-pulse-glow"
          >
            <AnimatePresence>
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                >
                  <X className="w-8 h-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                >
                  <Bot className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-28 right-8 z-40 w-full max-w-sm"
          >
            <Card className="glass-card shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="gradient-text flex items-center gap-2">
                  <Bot /> AI Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleToggle}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <p>AI chat interface coming soon!</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Input placeholder="Ask me anything..." className="bg-slate-800/50 border-slate-700"/>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}