"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AssistantPayload, getAssistantReply, roadmapReply, seedQuestion } from '../data/chat';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export type Feedback = 'up' | 'down' | null;

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  time: string;
  text?: string;
  content?: string;
  attachment?: string;
  payload?: AssistantPayload;
  pending?: boolean;
  feedback?: Feedback;
  created_at?: string;
};

type ChatValue = {
  messages: ChatMessage[];
  isThinking: boolean;
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, attachment?: string) => Promise<void>;
  loadMessages: () => Promise<void>;
  resetChat: () => Promise<void>;
  clearChat: () => Promise<void>;
  setFeedback: (id: string, value: Feedback) => void;
  buildTranscript: () => string;
};

const ChatContext = createContext<ChatValue | null>(null);

const formatTime = (date?: string | Date) => {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isStreamingRef = useRef(false);

  // Load conversation history from Supabase on user mount or change
  const loadMessages = useCallback(async () => {
    if (!user) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const q = user?.id || user?.email ? `?userId=${encodeURIComponent(user.id || user.email)}` : '';
      const res = await fetch(`/api/copilot/messages${q}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const formatted: ChatMessage[] = data.messages.map((m: any) => ({
            id: m.id || `msg-${Date.now()}-${Math.random()}`,
            role: m.role,
            text: m.content,
            content: m.content,
            time: formatTime(m.created_at),
            feedback: m.feedback || null,
            created_at: m.created_at,
          }));
          setMessages(formatted);
        } else {
          // Default empty or seed message if desired
          setMessages([]);
        }
      }
    } catch (e: any) {
      console.warn('Error loading copilot messages:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Send message and handle real-time streaming tokens
  const sendMessage = useCallback(
    async (text: string, attachment?: string) => {
      const trimmed = text.trim();
      if (!trimmed && !attachment) return;
      if (isStreamingRef.current || isThinking) return;

      const userMsgId = `user-${Date.now()}`;
      const assistantMsgId = `assistant-${Date.now()}`;
      const timeStamp = formatTime();

      const userMsg: ChatMessage = {
        id: userMsgId,
        role: 'user',
        text: trimmed,
        content: trimmed,
        attachment,
        time: timeStamp,
      };

      const pendingAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        text: '',
        content: '',
        pending: true,
        time: timeStamp,
        feedback: null,
      };

      setMessages((prev) => [...prev, userMsg, pendingAssistantMsg]);
      setIsThinking(true);
      setError(null);
      isStreamingRef.current = true;

      try {
        let activeCvPayload: any = undefined;
        try {
          const raw = localStorage.getItem('3watly_parsed_cv');
          if (raw) activeCvPayload = JSON.parse(raw);
        } catch {}

        const response = await fetch('/api/copilot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            attachment,
            userId: user?.id,
            activeCv: activeCvPayload,
            user: user
              ? {
                  id: user.id,
                  email: user.email,
                  fullName: user.fullName,
                  targetRole: activeCvPayload?.targetRole || user.targetRole,
                }
              : undefined,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('يرجى تسجيل الدخول لاستخدام المساعد الذكي / Please log in to chat.');
            throw new Error('Unauthorized');
          }
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server error ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream available');

        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    text: accumulatedText,
                    content: accumulatedText,
                    pending: false,
                  }
                : msg
            )
          );
        }

        // Final state sync
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text: accumulatedText,
                  content: accumulatedText,
                  pending: false,
                }
              : msg
          )
        );
      } catch (err: any) {
        console.error('Streaming error in ChatContext:', err);
        setError(err?.message || 'Failed to send message');

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text:
                    msg.text ||
                    'عذراً، حدث خطأ أثناء الاتصال بمساعد 3watly الذكي. يرجى التحقق من الاتصال والمحاولة مجدداً.',
                  pending: false,
                }
              : msg
          )
        );
      } finally {
        setIsThinking(false);
        isStreamingRef.current = false;
      }
    },
    [isThinking]
  );

  // Clear/Reset chat conversation
  const resetChat = useCallback(async () => {
    setIsThinking(false);
    isStreamingRef.current = false;
    setMessages([]);

    try {
      const q = user?.id || user?.email ? `?userId=${encodeURIComponent(user.id || user.email)}` : '';
      await fetch(`/api/copilot/messages${q}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to clear messages from server:', e);
    }
  }, [user]);

  const clearChat = resetChat;

  const setFeedback = useCallback((id: string, value: Feedback) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: value } : m))
    );
  }, []);

  const buildTranscript = useCallback(() => {
    return messages
      .filter((m) => !m.pending)
      .map((m) => {
        const roleName = m.role === 'user' ? 'You' : '3WATLY';
        const text = m.text || m.content || '';
        const attachmentStr = m.attachment ? ` [Attachment: ${m.attachment}]` : '';
        return `[${m.time}] ${roleName}: ${text}${attachmentStr}`;
      })
      .filter(Boolean)
      .join('\n\n');
  }, [messages]);

  const value = useMemo(
    () => ({
      messages,
      isThinking,
      isLoading,
      error,
      sendMessage,
      loadMessages,
      resetChat,
      clearChat,
      setFeedback,
      buildTranscript,
    }),
    [
      messages,
      isThinking,
      isLoading,
      error,
      sendMessage,
      loadMessages,
      resetChat,
      clearChat,
      setFeedback,
      buildTranscript,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}