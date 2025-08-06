import { serverConstants } from '@/config/constants.server';
import { rankDiscordRoles } from '@/config/discord-roles';
import { Rank } from '@/config/enums';
import { discordBotClient } from '@/discord';
import { APIGuildMember, Routes } from 'discord-api-types/v10';

export async function assignRankDiscordRole(rank: Rank, submitterId: string) {
  console.log('🔍 assignRankDiscordRole called with:', { rank, submitterId });

  const { guildId } = serverConstants.discord;
  console.log('🔍 guildId:', guildId);

  const { roles } = (await discordBotClient.get(
    Routes.guildMember(guildId, submitterId),
  )) as APIGuildMember;

  console.log('🔍 User current roles:', roles);

  // It's not possible to remove multiple roles in a single call,
  // so we filter the roles to avoid making 10+ requests each time
  // The current rank is excluded as it can cause race conditions when removing and adding it again.
  const appliedRankRoles = Object.entries(rankDiscordRoles).filter(
    ([rankName, roleId]) => rankName !== rank && roles.includes(roleId),
  );

  console.log('🔍 Applied rank roles to remove:', appliedRankRoles);

  // Remove all existing rank roles
  await Promise.all([
    appliedRankRoles.map(([, roleId]) =>
      discordBotClient.delete(
        Routes.guildMemberRole(guildId, submitterId, roleId),
      ),
    ),
  ]);

  const approvedRole = rankDiscordRoles[rank as keyof typeof rankDiscordRoles];
  console.log('🔍 Looking up role for rank:', { rank, approvedRole });
  console.log('🔍 Available ranks in rankDiscordRoles:', Object.keys(rankDiscordRoles));

  // Apply the approved role if the user doesn't already have it
  if (!roles.includes(approvedRole)) {
    console.log('🔍 Assigning role:', { approvedRole, submitterId, guildId });
    await discordBotClient.put(
      Routes.guildMemberRole(guildId, submitterId, approvedRole),
    );
    console.log('🔍 Role assigned successfully');
  } else {
    console.log('🔍 User already has role:', approvedRole);
  }
}
