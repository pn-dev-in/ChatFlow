import OpenAI from 'openai';
import { env } from '../config/env';
import { AppError, NotFoundError, ForbiddenError } from '../utils/errors';
import { aiRepository } from '../repositories/ai.repository';
import { messageRepository } from '../repositories/message.repository';
import { conversationRepository } from '../repositories/conversation.repository';

const openai = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are ChatFlow AI, a helpful assistant integrated into a real-time chat application. 
Be concise, friendly, and professional. Help users with messaging, writing, translation, and conversation tasks.`;

export class AiService {
  private ensureOpenAI() {
    if (!openai) {
      throw new AppError('AI service is not configured. Set OPENAI_API_KEY.', 503, 'AI_UNAVAILABLE');
    }
    return openai;
  }

  async createConversation(userId: string, title?: string) {
    return aiRepository.createConversation(userId, title);
  }

  async getConversations(userId: string) {
    return aiRepository.findUserConversations(userId);
  }

  async getConversation(aiConversationId: string, userId: string) {
    const conversation = await aiRepository.findConversation(aiConversationId, userId);
    if (!conversation) throw new NotFoundError('AI conversation not found');
    return conversation;
  }

  async sendMessage(aiConversationId: string, userId: string, content: string) {
    const conversation = await aiRepository.findConversation(aiConversationId, userId);
    if (!conversation) throw new NotFoundError('AI conversation not found');

    await aiRepository.addMessage({
      aiConversationId,
      role: 'user',
      content,
    });

    const client = this.ensureOpenAI();
    const history = conversation.messages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content },
      ],
      max_tokens: 1000,
    });

    const assistantContent = response.choices[0]?.message?.content || 'I could not generate a response.';
    const tokensUsed = response.usage?.total_tokens;

    const assistantMessage = await aiRepository.addMessage({
      aiConversationId,
      role: 'assistant',
      content: assistantContent,
      tokensUsed,
    });

    return assistantMessage;
  }

  async generateReply(text: string) {
    const client = this.ensureOpenAI();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Generate a concise, friendly reply to the following message. Return only the reply text.' },
        { role: 'user', content: text },
      ],
      max_tokens: 200,
    });
    return { reply: response.choices[0]?.message?.content || '' };
  }

  async summarizeConversation(conversationId: string, userId: string) {
    const isMember = await conversationRepository.isMember(conversationId, userId);
    if (!isMember) throw new ForbiddenError('Not a member of this conversation');

    const messages = await messageRepository.findByConversation(conversationId, { limit: 100 });
    const text = messages
      .filter((m) => m.content)
      .map((m) => `${m.sender.profile?.displayName || m.sender.username}: ${m.content}`)
      .join('\n');

    const client = this.ensureOpenAI();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Summarize the following conversation concisely in bullet points.' },
        { role: 'user', content: text },
      ],
      max_tokens: 500,
    });

    return { summary: response.choices[0]?.message?.content || '' };
  }

  async translate(text: string, targetLanguage: string) {
    const client = this.ensureOpenAI();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Translate the following text to ${targetLanguage}. Return only the translation.` },
        { role: 'user', content: text },
      ],
      max_tokens: 1000,
    });
    return { translation: response.choices[0]?.message?.content || '' };
  }

  async correctGrammar(text: string) {
    const client = this.ensureOpenAI();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Correct the grammar and spelling. Return only the corrected text.' },
        { role: 'user', content: text },
      ],
      max_tokens: 1000,
    });
    return { corrected: response.choices[0]?.message?.content || '' };
  }

  async getSuggestions(text: string) {
    const client = this.ensureOpenAI();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Provide 3 short reply suggestions as a JSON array of strings. Return only valid JSON.' },
        { role: 'user', content: text },
      ],
      max_tokens: 200,
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      const suggestions = JSON.parse(content);
      return { suggestions: Array.isArray(suggestions) ? suggestions : [] };
    } catch {
      return { suggestions: [] };
    }
  }

  async getAnalytics() {
    const [conversations, messages, tokensUsed] = await Promise.all([
      aiRepository.countConversations(),
      aiRepository.countMessages(),
      aiRepository.getTotalTokensUsed(),
    ]);
    return { conversations, messages, tokensUsed };
  }
}

export const aiService = new AiService();
