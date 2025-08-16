import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { CircleDotDashed as LucideIcon } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  icon: LucideIcon;
}

export function PlaceholderView({ title, icon: Icon }: PlaceholderViewProps) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex items-center justify-center"
    >
      <Card className="glass-card border-white/20 w-full max-w-2xl text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {Icon && <Icon className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            🚧 This feature isn't fully implemented yet—but don't worry! You can request more details and functionality in your next prompt! 🚀
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}