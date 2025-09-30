import {
  CombatDiaryTier,
  ClogDiaryTier,
} from '@/app/schemas/custom-diaries';
import { ClogRank, StandardRank } from './ranks';

export const rankDiscordRoles = {
  Sapphire: '1396388491364925581',
  Emerald: '1396388578937929769',
  'Red Topaz': '1396390215198969886',
  Zenyte: '1396388664933879828',
  Captain: '1396388794902515731',
  Astral: '1396388893745745982',
  Soul: '1396388970744647822',
  Completionist: '1396389094745182299',
  Scribe: '1396390319473299566',
  Learner: '1399181408920141844',
  Teacher: '1396390156721979514',
  Councillor: '1396390054393544735',
  Assistant: '1396389371489288223',
} satisfies Record<StandardRank | ClogRank, string>;

export const customDiaryDiscordRoles = {
  Combat: new Map<CombatDiaryTier, string>([
    ['Easy', '1385248680357003335'],
    ['Hard', '1385248881423417407'],
    ['Master', '1385248972037165086'],
    ['Grandmaster', '1385249095559549111'],
  ]),
  Clog: new Map<ClogDiaryTier, string>([
    ['Easy', '1399729580151144610'],
    ['Medium', '1399729884082999356'],
    ['Hard', '1399729884082999356'],
    ['Elite', '1399730120750534686'],
    ['Grandmaster', '1399730234307252264'],
  ]),
} as const satisfies {
  Combat: Map<CombatDiaryTier, string>;
  Clog: Map<ClogDiaryTier, string>;
};

export const achievementDiscordRoles = {} as const;
