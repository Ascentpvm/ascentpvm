import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';
import dedent from 'dedent';
import {
  APIDMChannel,
  ButtonStyle,
  ComponentType,
  Routes,
} from 'discord-api-types/v10';
import { NextRequest, NextResponse } from 'next/server';
import { fetchPlayerDetails } from '@/app/rank-calculator/data-sources/fetch-player-details/fetch-player-details';
import { calculateAchievementDiaryPoints } from '@/app/rank-calculator/utils/calculators/calculate-achievement-diary-points';
import { calculateCollectionLogAndCluesPoints } from '@/app/rank-calculator/utils/calculators/calculate-collection-log-and-clues-points';
import { calculateCollectionLogSlotPoints } from '@/app/rank-calculator/utils/calculators/calculate-collection-log-slot-points';
import { calculateCombatAchievementPoints } from '@/app/rank-calculator/utils/calculators/calculate-combat-achievement-points';
import { calculateCombatPoints } from '@/app/rank-calculator/utils/calculators/calculate-combat-points';
import { calculateEhbPoints } from '@/app/rank-calculator/utils/calculators/calculate-ehb-points';
import { calculateEhpPoints } from '@/app/rank-calculator/utils/calculators/calculate-ehp-points';
import { calculateNotableItemsPoints } from '@/app/rank-calculator/utils/calculators/calculate-notable-items-points';
import { calculateRank } from '@/app/rank-calculator/utils/calculators/calculate-rank';
import { calculateScaling } from '@/app/rank-calculator/utils/calculators/calculate-scaling';
import { calculateSkillingPoints } from '@/app/rank-calculator/utils/calculators/calculate-skilling-points';
import { calculateTotalLevelPoints } from '@/app/rank-calculator/utils/calculators/calculate-total-level-points';
import { calculateTotalPoints } from '@/app/rank-calculator/utils/calculators/calculate-total-points';
import { getRankName } from '@/app/rank-calculator/utils/get-rank-name';
import { sendDiscordMessage } from '@/app/rank-calculator/utils/send-discord-message';
import { clientConstants } from '@/config/constants.client';
import { rankUpMessagesKey } from '@/config/redis';
import { discordBotClient } from '@/discord';
import { redis } from '@/redis';
import {
  fetchItemDropRates,
  generateRequiredItemList,
} from '@/app/rank-calculator/data-sources/fetch-dropped-item-info';
import { buildNotableItemList } from '@/app/rank-calculator/utils/build-notable-item-list';
import { calculateAchievementDiaryCapePoints } from '@/app/rank-calculator/utils/calculators/calculate-achievement-diary-cape-points';
import { calculateTzhaarCapePoints } from '@/app/rank-calculator/utils/calculators/calculate-tzhaar-cape-points';
import { calculateBloodTorvaPoints } from '@/app/rank-calculator/utils/calculators/calculate-blood-torva-points';
import { calculateDizanasQuiverPoints } from '@/app/rank-calculator/utils/calculators/calculate-dizanas-quiver-points';
import { calculateClueScrollPoints } from '@/app/rank-calculator/utils/calculators/calculate-clue-scroll-points';
import { calculateRadiantOathplatePoints } from '@/app/rank-calculator/utils/calculators/calculate-radiant-oathplate-points';

export async function GET(request: NextRequest) {
  try {
    const player = z
      .string({ required_error: 'Player is required' })
      .transform((encodedPlayer) => decodeURIComponent(encodedPlayer))
      .parse(request.nextUrl.searchParams.get('player'));

    const discordId = z
      .string({ required_error: 'Discord ID is required' })
      .parse(request.nextUrl.searchParams.get('discord_id'));

    const playerDetails = await fetchPlayerDetails(player, discordId);

    if (!playerDetails.success) {
      throw new Error('Failed to fetch player details');
    }

    const {
      joinDate,
      collectionLogTotal,
      collectionLogCount,
      acquiredItems,
      achievementDiaries,
      ehp,
      ehb,
      totalLevel,
      combatAchievementTier,
      currentRank,
      hasThirdPartyData,
      playerName,
      rankStructure,
      tzhaarCape,
      hasBloodTorva,
      hasRadiantOathplate,
      hasDizanasQuiver,
      hasAchievementDiaryCape,
      collectionLogBonusPoints,
      combatBonusPoints,
      notableItemsBonusPoints,
      skillingBonusPoints,
      clueScrollCounts,
    } = playerDetails.data;

    if (!hasThirdPartyData) {
      return NextResponse.json({ success: true });
    }

    const dropRates = await fetchItemDropRates([...generateRequiredItemList()]);
    const items = Object.entries(await buildNotableItemList(dropRates));
    const scaling = calculateScaling(joinDate);
    const collectionLogSlotPoints = calculateCollectionLogSlotPoints(
      collectionLogCount,
      scaling,
    );
    const { totalPoints: clueScrollPoints } = calculateClueScrollPoints(
      clueScrollCounts,
      scaling,
    );
    const { pointsAwarded: totalCollectionLogPoints } =
      calculateCollectionLogAndCluesPoints(
        collectionLogSlotPoints,
        collectionLogTotal,
        clueScrollPoints,
        collectionLogBonusPoints,
        0.0,
        scaling,
      );
    const { pointsAwarded: totalNotableItemsPoints } =
      calculateNotableItemsPoints(
        items,
        acquiredItems,
        notableItemsBonusPoints,
        scaling,
      );
    const { pointsAwarded: achievementDiariesPoints } =
      calculateAchievementDiaryPoints(achievementDiaries, scaling);
    const ehpPoints = calculateEhpPoints(ehp, scaling);
    const totalLevelPoints = calculateTotalLevelPoints(totalLevel, scaling);
    const achievementDiaryCapePoints = calculateAchievementDiaryCapePoints(
      hasAchievementDiaryCape,
      scaling,
    );
    const { pointsAwarded: totalSkillingPoints } = calculateSkillingPoints(
      achievementDiariesPoints,
      ehpPoints,
      totalLevelPoints,
      achievementDiaryCapePoints,
      skillingBonusPoints,
      scaling,
    );
    const ehbPoints = calculateEhbPoints(ehb);
    const combatAchievementTierPoints = calculateCombatAchievementPoints(
      combatAchievementTier,
      scaling,
    );
    const tzhaarCapePoints = calculateTzhaarCapePoints(tzhaarCape, scaling);
    const bloodTorvaPoints = calculateBloodTorvaPoints(hasBloodTorva, scaling);
    const radiantOathplatePoints = calculateRadiantOathplatePoints(
      hasRadiantOathplate,
      scaling,
    );
    const dizanasQuiverPoints = calculateDizanasQuiverPoints(
      hasDizanasQuiver,
      scaling,
    );
    const { pointsAwarded: totalCombatPoints } = calculateCombatPoints(
      ehbPoints,
      combatAchievementTierPoints,
      tzhaarCapePoints,
      bloodTorvaPoints,
      radiantOathplatePoints,
      dizanasQuiverPoints,
      combatBonusPoints,
      scaling,
    );
    const totalPointsAwarded = calculateTotalPoints(
      totalCollectionLogPoints,
      totalNotableItemsPoints,
      totalSkillingPoints,
      totalCombatPoints,
    );
    const { rank } = calculateRank(
      acquiredItems,
      combatAchievementTier,
      totalPointsAwarded,
      collectionLogCount,
      rankStructure,
    );

    if (rank !== currentRank) {
      const hashKey = `${discordId}:${player.toLowerCase()}`;
      const previousMessageRank = await redis.hget(rankUpMessagesKey, hashKey);

      // Send a message if the user has not been notified of this rank in the past
      if (previousMessageRank !== rank) {
        const { id: dmChannelId } = (await discordBotClient.post(
          Routes.userChannels(),
          { body: { recipient_id: discordId } },
        )) as APIDMChannel;

        await sendDiscordMessage(
          {
            content: dedent`
              Congratulations, you are eligible for the ${getRankName(rank)} rank on ${playerName}!
              
              Click the button below to go to the rank calculator and apply.
            `,
            components: [
              {
                components: [
                  {
                    label: 'Apply for rank',
                    url: `${clientConstants.publicUrl}/rank-calculator/${encodeURIComponent(player)}`,
                    style: ButtonStyle.Link,
                    type: ComponentType.Button,
                  },
                ],
                type: ComponentType.ActionRow,
              },
            ],
          },
          dmChannelId,
        );

        await redis.hset(rankUpMessagesKey, { [hashKey]: rank });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);

    return NextResponse.json({ success: false });
  }
}
