import 'server-only';
import { z } from 'zod';

const ServerConfigSchema = z.object({
  zeplo: z.object({
    apiKey: z.string(),
    url: z.string(),
  }),
  temple: z.object({
    groupName: z.string(),
    groupId: z.string(),
    groupKey: z.string(),
    privateGroup: z.string(),
  }),
  redisUrl: z.string(),
  discord: z.object({
    token: z.string(),
    guildId: z.string(),
    channelId: z.string(),
  }),
  supabase: z.object({
    url: z.string(),
    anonKey: z.string(),
  }),
});

export const serverConstants = ServerConfigSchema.parse({
  zeplo: {
    apiKey: '',
    url: '',
  },
  temple: {
    groupName: '',
    groupId: '',
    groupKey: '',
    privateGroup: '',
  },
  redisUrl: process.env.KV_REST_API_URL,
  discord: {
    token: process.env.DISCORD_TOKEN,
    guildId: process.env.DISCORD_GUILD_ID,
    channelId: process.env.DISCORD_CHANNEL_ID,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
});
