'use client';

import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  names?: string[];
}

export function TypingIndicator({ names = [] }: TypingIndicatorProps) {
  const text =
    names.length === 0
      ? 'Someone is typing'
      : names.length === 1
        ? `${names[0]} is typing`
        : `${names.slice(0, 2).join(', ')} are typing`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span>{text}</span>
    </div>
  );
}
