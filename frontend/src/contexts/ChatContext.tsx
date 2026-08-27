import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AssistantPayload, getAssistantReply, roadmapReply, seedQuestion } from '../data/chat';

export type Feedback = 'up' | 'down' | null;

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  time: string;
  text?: string;
  attachment?: string;
  payload?: AssistantPayload;
  pending?: boolean;
  feedback?: Feedback;
};

type ChatValue = {
  messages: ChatMessage[];
  isThinking: boolean;
  sendMessage: (text: string, attachment?: string) => void;
  resetChat: () => void;
  setFeedback: (id: string, value: Feedback) => void;
  buildTranscript: () => string;
};

const ChatContext = createContext<ChatValue | null>(null);

const clock = () =>
new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

const seedMessages = (): ChatMessage[] => [
{ id: 'seed-user', role: 'user', text: seedQuestion, time: '10:42 AM' },
{ id: 'seed-assistant', role: 'assistant', payload: roadmapReply, time: '10:42 AM', feedback: null }];


export function ChatProvider({ children }: {children: React.ReactNode;}) {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [isThinking, setIsThinking] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const sendMessage = useCallback((text: string, attachment?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const stamp = clock();
    const id = `m-${Date.now()}`;

    setMessages((prev) => [
    ...prev,
    { id: `${id}-u`, role: 'user', text: trimmed, attachment, time: stamp },
    { id: `${id}-p`, role: 'assistant', pending: true, time: stamp }]
    );
    setIsThinking(true);

    const timer = setTimeout(() => {
      setMessages((prev) =>
      prev.map((message) =>
      message.id === `${id}-p` ?
      {
        id: `${id}-a`,
        role: 'assistant',
        payload: getAssistantReply(trimmed || 'review my cv'),
        time: clock(),
        feedback: null
      } :
      message
      )
      );
      setIsThinking(false);
    }, 1100);

    timers.current.push(timer);
  }, []);

  const resetChat = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setIsThinking(false);
    setMessages([]);
  }, []);

  const setFeedback = useCallback((id: string, value: Feedback) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, feedback: value } : m));
  }, []);

  const buildTranscript = useCallback(() => {
    return messages.
    filter((m) => !m.pending).
    map((m) => {
      if (m.role === 'user') return `[${m.time}] You: ${m.text}${m.attachment ? ` (attached: ${m.attachment})` : ''}`;
      const payload = m.payload;
      if (!payload) return '';
      const lines = [
      `[${m.time}] MAJRA: ${payload.intro}`,
      ...payload.points.map((p, i) => `  ${i + 1}. ${p.text.replace(/\*\*/g, '')}${p.source ? ` ${p.source}` : ''}`)];

      if (payload.outro) lines.push(`  ${payload.outro}`);
      return lines.join('\n');
    }).
    filter(Boolean).
    join('\n\n');
  }, [messages]);

  const value = useMemo(
    () => ({ messages, isThinking, sendMessage, resetChat, setFeedback, buildTranscript }),
    [messages, isThinking, sendMessage, resetChat, setFeedback, buildTranscript]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}