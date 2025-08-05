import 'core-js/actual/set/intersection';
import 'core-js/actual/set/is-subset-of';
import { itemList } from '@/data/item-list';
import {
  userDraftRankSubmissionKey,
  userOSRSAccountsKey,
} from '@/config/redis';
import { stripEntityName } from '@/app/rank-calculator/utils/strip-entity-name';
import { ApiResponse } from '@/types/api';
import * as Sentry from '@sentry/nextjs';
import { Rank } from '@/config/enums';
import { redis } from '@/redis';
import { Player } from '@/app/schemas/player';
import { clientConstants } from '@/config/constants.client';
import { redirect } from 'next/navigation';
import {
  CollectionLogAcquiredItemMap,
  isHolidayTrack,
} from '@/app/schemas/wiki';
import { TzHaarCape } from '@/app/schemas/osrs';
import { isItemAcquired } from './utils/is-item-acquired';
import { getWikiSyncData } from './get-wikisync-data';
import { fetchTemplePlayerStats } from '../fetch-temple-player-stats';
import { calculateCombatAchievementTier } from './utils/calculate-combat-achievement-tier';
import { parseAchievementDiaries } from './utils/parse-achievement-diaries';
import { mergeCombatAchievementTier } from './utils/merge-combat-achievement-tier';
import { mergeAchievementDiaries } from './utils/merge-achievement-diaries';
import { calculateEfficiencyData } from './utils/calculate-efficiency-data';
import { RankCalculatorSchema } from '../../[player]/submit-rank-calculator-validation';
import { validatePlayerExists } from '../../players/validation/player-validation';
import { fetchTemplePlayerCollectionLog } from './fetch-temple-collection-log';
import { fetchTempleConstants } from './fetch-temple-constants';
import { mergeTzhaarCapes } from './utils/merge-tzhaar-capes';
import { isAchievementDiaryCapeAchieved } from '../../utils/is-achievement-diary-cape-achieved';
import { fetchUserDiscordRoles } from '../fetch-user-discord-roles';
import { calculateCombatDiaryTierBonusPoints } from '../../utils/calculators/calculate-custom-diary-tier-multipliers';

export interface PlayerDetailsResponse
  extends Omit<RankCalculatorSchema, 'rank' | 'points'> {
  currentRank?: Rank;
  hasTemplePlayerStats: boolean;
  hasTempleCollectionLog: boolean;
  hasWikiSyncData: boolean;
  hasThirdPartyData: boolean;
  isTempleCollectionLogOutdated: boolean;
  isMobileOnly: boolean;
}

export const emptyResponse = {
  achievementDiaries: {
    'Kourend & Kebos': 'None',
    'Lumbridge & Draynor': 'None',
    'Western Provinces': 'None',
    Ardougne: 'None',
    Desert: 'None',
    Falador: 'None',
    Fremennik: 'None',
    Kandarin: 'None',
    Karamja: 'None',
    Morytania: 'None',
    Varrock: 'None',
    Wilderness: 'None',
  },
  acquiredItems: {},
  joinDate: new Date(),
  collectionLogCount: 0,
  collectionLogTotal: 0,
  combatAchievementTier: 'None',
  ehb: 0,
  ehp: 0,
  ehc: 0,
  totalLevel: 0,
  isCompletionist: false,
  playerName: '',
  rankStructure: 'Standard',
  proofLink: null,
  hasTemplePlayerStats: false,
  hasTempleCollectionLog: false,
  hasWikiSyncData: false,
  hasThirdPartyData: false,
  isTempleCollectionLogOutdated: false,
  isMobileOnly: false,
  tzhaarCape: 'None',
  tobKillCount: 0,
  toaExpertKillCount: 0,
  slayerLevel: 1,
  chambersOfXericCmKillCount: 0,
  hasBloodTorva: false,
  hasRadiantOathplate: false,
  hasDizanasQuiver: false,
  hasAchievementDiaryCape: false,
  combatBonusPoints: 0,
  skillingBonusPoints: 0,
  collectionLogBonusPoints: 0,
  notableItemsBonusPoints: 0,
  clueScrollCounts: {
    Beginner: 0,
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Elite: 0,
    Master: 0,
  },
} satisfies PlayerDetailsResponse;

export async function fetchPlayerDetails(
  player: string,
  userId: string,
  mergeSavedData = true,
): Promise<ApiResponse<PlayerDetailsResponse>> {
  const playerRecord = await redis.hget<Player>(
    userOSRSAccountsKey(userId),
    player.toLowerCase(),
  );

  if (!playerRecord) {
    throw new Error('Unable to find player record');
  }

  Sentry.setTag('has-player-record', true);

  if (playerRecord.isNameInvalid) {
    redirect(`/rank-calculator/players/edit/${player}`);
  }

  const isPlayerNameValid = await validatePlayerExists(player);

  if (!isPlayerNameValid) {
    // Flag the account as having an invalid name, and force the user to edit it
    await redis.hset<Player>(userOSRSAccountsKey(userId), {
      [player.toLowerCase()]: { ...playerRecord, isNameInvalid: true },
    });

    redirect(`/rank-calculator/players/edit/${player}`);
  }

  // Update Temple to get the most up-to-date info
  // Ignore any errors as this isn't required to succeed
  try {
    await fetch(
      `${clientConstants.temple.baseUrl}/php/add_datapoint.php?player=${player}`,
    );
  } catch (error) {
    Sentry.captureException(error);
  }

  try {
    const savedData = mergeSavedData
      ? await redis.json.get<RankCalculatorSchema>(
        userDraftRankSubmissionKey(userId, player),
      )
      : undefined;
    const { joinDate, rsn, rank: currentRank } = playerRecord;
    const [wikiSyncData, templePlayerStats, templeCollectionLog, discordRoles] =
      await Promise.all([
        getWikiSyncData(player),
        fetchTemplePlayerStats(player, true),
        fetchTemplePlayerCollectionLog(player),
        fetchUserDiscordRoles(userId),
      ]);

    const hasThirdPartyData = Boolean(
      wikiSyncData ?? templePlayerStats ?? templeCollectionLog,
    );

    Sentry.setTags({
      'has-wikisync-data': !!wikiSyncData,
      'has-temple-data': !!templePlayerStats,
      'has-temple-collection-log-data': !!templeCollectionLog,
      'has-saved-data': !!savedData,
      'has-third-party-data': hasThirdPartyData,
    });

    if (!hasThirdPartyData && !savedData) {
      return { error: null, success: true, data: emptyResponse };
    }

    const collectionLogTotal =
      templeCollectionLog?.total_collections_available ??
      (await fetchTempleConstants())?.MAX_COLLECTION_LOGS;

    if (!collectionLogTotal) {
      throw new Error('Unable to determine max collection log slots');
    }

    const combatAchievementTier = wikiSyncData
      ? await calculateCombatAchievementTier(wikiSyncData.combat_achievements)
      : null;

    const {
      Overall_level: totalLevel = null,
      Collections: hiscoresCollectionLogCount = null,
      'TzKal-Zuk': zukKillCount = null,
      Clue_beginner: beginnerClueCount = null,
      Clue_easy: easyClueCount = null,
      Clue_medium: mediumClueCount = null,
      Clue_hard: hardClueCount = null,
      Clue_elite: eliteClueCount = null,
      Clue_master: masterClueCount = null,
      'Chambers of Xeric Challenge Mode': chambersCmKillCount = null,
      'Theatre of Blood': tobKillCount = null,
      'Tombs of Amascut Expert': toaExpertKillCount = null,
      Slayer_level: slayerLevel = null,
    } = templePlayerStats ?? {};
    const { ehb, ehp } = calculateEfficiencyData(templePlayerStats);

    const { total_collections_finished: templeCollectionLogCount = null, ehc: templeEfficientHoursClogged = null } =
      templeCollectionLog ?? {};

    const isTempleCollectionLogOutdated =
      templeCollectionLogCount && hiscoresCollectionLogCount
        ? templeCollectionLogCount < hiscoresCollectionLogCount
        : false;

    const {
      achievementDiaries = null,
      quests = null,
      musicTracks = null,
      combatAchievements = null,
    } = wikiSyncData
        ? {
          achievementDiaries: parseAchievementDiaries(
            wikiSyncData.achievement_diaries,
          ),
          quests: wikiSyncData.quests,
          musicTracks: wikiSyncData.music_tracks,
          combatAchievements: wikiSyncData.combat_achievements,
        }
        : {};

    const collectionLogItems =
      templeCollectionLog?.items.reduce(
        (acc, { name, count }) => ({ ...acc, [stripEntityName(name)]: count }),
        CollectionLogAcquiredItemMap.parse({}),
      ) ?? null;

    const acquiredItems =
      wikiSyncData || templeCollectionLog
        ? Object.values(itemList)
          .flatMap(({ items }) => items)
          .filter((item) =>
            isItemAcquired(item, {
              acquiredItems: collectionLogItems,
              quests,
              combatAchievements,
            }),
          )
          .map(({ name }) => stripEntityName(name))
        : [];

    const itemsThatGivePoints = Object.values(itemList)
      .flatMap(({ items }) => items)
      .filter(({ points }) => points > 0)
      .map(({ name }) => stripEntityName(name));

    const previouslyAcquiredItems = savedData
      ? Object.keys(savedData.acquiredItems).filter(
        (key) => savedData.acquiredItems[key],
      )
      : [];

    const allCurrentNotableItemNames = new Set(
      Object.values(itemList)
        .flatMap(({ items }) => items)
        .map(({ name }) => stripEntityName(name)),
    );

    const hasMusicCape = musicTracks
      ? Object.entries(musicTracks)
        .filter(([track]) => !isHolidayTrack(track))
        .every(([, unlocked]) => unlocked)
      : false;

    const acquiredItemsMap = [
      ...new Set(acquiredItems.concat(previouslyAcquiredItems)).intersection(
        allCurrentNotableItemNames,
      ),
    ].reduce<Record<string, boolean>>(
      (acc, val) => ({ ...acc, [stripEntityName(val)]: true }),
      { ...(hasMusicCape && { 'Music cape': true }) },
    );

    let isCompletionist = true;

    // Check if the player has items that give points
    for (const item of itemsThatGivePoints) {
      if (acquiredItemsMap[item] !== true) {
        isCompletionist = false;
      }
    }

    const proofLink =
      savedData?.proofLink ??
      (templeCollectionLog
        ? `${clientConstants.temple.baseUrl}/player/collection-log.php?player=${player}`
        : null);

    const hasInfernalCape = zukKillCount ? zukKillCount > 0 : false;
    const hasFireCape =
      wikiSyncData?.combat_achievements.includes(
        147, // https://oldschool.runescape.wiki/w/Fight_Caves_Veteran
      ) ?? false;

    const tzhaarCape =
      (hasInfernalCape && TzHaarCape.enum['Infernal cape']) ||
      (hasFireCape && TzHaarCape.enum['Fire cape']) ||
      TzHaarCape.enum.None;

    const hasBloodTorva = new Set([
      490, // https://oldschool.runescape.wiki/w/Vardorvis_Sleeper
      499, // https://oldschool.runescape.wiki/w/Whispered
      508, // https://oldschool.runescape.wiki/w/Leviathan_Sleeper
      517, // https://oldschool.runescape.wiki/w/Duke_Sucellus_Sleeper
    ]).isSubsetOf(new Set(wikiSyncData?.combat_achievements));

    const hasDizanasQuiver =
      wikiSyncData?.combat_achievements.includes(
        538, // https://oldschool.runescape.wiki/w/Sportsmanship
      ) ?? false;

    const hasAchievementDiaryCape = achievementDiaries
      ? isAchievementDiaryCapeAchieved(achievementDiaries)
      : false;

    const { combatBonusPoints, collectionLogBonusPoints } =
      calculateCombatDiaryTierBonusPoints(discordRoles);

    return {
      success: true,
      error: null,
      data: {
        achievementDiaries:
          mergeAchievementDiaries(
            achievementDiaries,
            savedData?.achievementDiaries ?? null,
          ) ?? emptyResponse.achievementDiaries,
        acquiredItems: acquiredItemsMap,
        combatAchievementTier:
          mergeCombatAchievementTier(
            combatAchievementTier,
            savedData?.combatAchievementTier ?? null,
          ) ?? 'None',
        collectionLogCount: Math.max(
          templeCollectionLogCount ?? 0,
          hiscoresCollectionLogCount ?? 0,
          savedData?.collectionLogCount ?? 0,
        ),
        ehb: Math.round(ehb ?? savedData?.ehb ?? 0),
        ehp: Math.round(ehp ?? savedData?.ehp ?? 0),
        isCompletionist,
        ehc: Math.round(templeEfficientHoursClogged ?? savedData?.ehc ?? 0),
        totalLevel: Math.max(totalLevel ?? 0, savedData?.totalLevel ?? 0),
        collectionLogTotal,
        joinDate,
        playerName: rsn,
        rankStructure: savedData?.rankStructure ?? 'Standard',
        proofLink,
        currentRank,
        tzhaarCape: mergeTzhaarCapes(tzhaarCape, savedData?.tzhaarCape),
        tobKillCount: tobKillCount ?? savedData?.tobKillCount ?? 0,
        toaExpertKillCount:
          toaExpertKillCount ?? savedData?.toaExpertKillCount ?? 0,
        slayerLevel: slayerLevel ?? savedData?.slayerLevel ?? 1,
        chambersOfXericCmKillCount:
          chambersCmKillCount ?? savedData?.chambersOfXericCmKillCount ?? 0,
        hasBloodTorva: (hasBloodTorva || savedData?.hasBloodTorva) ?? false,
        hasRadiantOathplate: savedData?.hasRadiantOathplate ?? false,
        hasDizanasQuiver:
          (hasDizanasQuiver || savedData?.hasDizanasQuiver) ?? false,
        hasAchievementDiaryCape:
          (hasAchievementDiaryCape || savedData?.hasAchievementDiaryCape) ??
          false,
        hasTemplePlayerStats: !!templePlayerStats,
        hasTempleCollectionLog: !!templeCollectionLog,
        hasWikiSyncData: !!wikiSyncData,
        hasThirdPartyData,
        isTempleCollectionLogOutdated,
        isMobileOnly: playerRecord.isMobileOnly,
        collectionLogBonusPoints: collectionLogBonusPoints,
        combatBonusPoints,
        skillingBonusPoints: 0, // Leaving this in for future use, if we decide to add a skilling diary
        notableItemsBonusPoints: 0, // Leaving this in for future use, if we decide to add a notable items diary
        clueScrollCounts: {
          Beginner: beginnerClueCount ?? 0,
          Easy: easyClueCount ?? 0,
          Medium: mediumClueCount ?? 0,
          Hard: hardClueCount ?? 0,
          Elite: eliteClueCount ?? 0,
          Master: masterClueCount ?? 0,
        },
      },
    };
  } catch (error) {
    Sentry.captureException(error);

    return { error: 'Something went wrong', success: false };
  }
}
