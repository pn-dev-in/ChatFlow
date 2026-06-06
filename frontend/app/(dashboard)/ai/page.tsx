'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Send, Plus, Languages, FileText, Wand2 } from 'lucide-react';
import { aiService } from '@/services/ai.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AiConversation } from '@/types';

export default function AiPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [toolText, setToolText] = useState('');
  const [toolResult, setToolResult] = useState('');
  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery({
    queryKey: ['ai-conversations'],
    queryFn: aiService.getConversations,
  });

  const { data: activeConversation } = useQuery({
    queryKey: ['ai-conversation', activeId],
    queryFn: () => aiService.getConversation(activeId!),
    enabled: !!activeId,
  });

  const createMutation = useMutation({
    mutationFn: () => aiService.createConversation('New AI Chat'),
    onSuccess: (conv) => {
      setActiveId(conv.id);
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => aiService.sendMessage(activeId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversation', activeId] });
      setInput('');
    },
  });

  const runTool = async (tool: 'translate' | 'grammar' | 'reply') => {
    if (!toolText) return;
    let result = '';
    if (tool === 'translate') result = await aiService.translate(toolText, 'Spanish');
    else if (tool === 'grammar') result = await aiService.correctGrammar(toolText);
    else result = await aiService.generateReply(toolText);
    setToolResult(result);
  };

  return (
    <div className="flex h-full">
      <div className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <Button onClick={() => createMutation.mutate()} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" /> New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv: AiConversation) => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`w-full text-left rounded-lg p-3 text-sm ${
                  activeId === conv.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                <Sparkles className="h-4 w-4 inline mr-2" />
                {conv.title}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {activeId ? (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-2xl mx-auto space-y-4">
                {activeConversation?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="max-w-2xl mx-auto flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && input.trim() && sendMutation.mutate(input)}
                  placeholder="Ask ChatFlow AI..."
                  className="flex-1"
                />
                <Button onClick={() => input.trim() && sendMutation.mutate(input)} disabled={sendMutation.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>Select or create an AI conversation</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-72 border-l p-4 space-y-4 hidden lg:block">
        <h3 className="font-semibold">AI Tools</h3>
        <Input
          value={toolText}
          onChange={(e) => setToolText(e.target.value)}
          placeholder="Enter text..."
        />
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => runTool('translate')}>
            <Languages className="h-4 w-4 mr-2" /> Translate
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => runTool('grammar')}>
            <Wand2 className="h-4 w-4 mr-2" /> Fix Grammar
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => runTool('reply')}>
            <FileText className="h-4 w-4 mr-2" /> Generate Reply
          </Button>
        </div>
        {toolResult && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">Result:</p>
            <p className="whitespace-pre-wrap">{toolResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
