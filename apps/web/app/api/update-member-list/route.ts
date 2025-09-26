import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { clientConstants } from '@/config/constants.client';
import { GroupUpdateRequest } from '@/app/schemas/temple-api';
import { serverConstants } from '@/config/constants.server';
import { ClanExport } from '@/app/schemas/inactivity-checker';
import mysql from 'mysql2/promise'

async function getDbConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  });
}

export async function POST(request: NextRequest) {
  const updateTemple =
    request.nextUrl.searchParams.get('updateTemple') ?? 'true';
  const body = ClanExport.parse(await request.json());

  if (updateTemple === 'true') {
    const { members, leaders } = body.clanMemberMaps.reduce(
      (acc, member) => {
        if (clientConstants.ranks.leaders.includes(member.rank)) {
          return { ...acc, leaders: acc.leaders.concat(member.rsn) };
        }

        return { ...acc, members: acc.members.concat(member.rsn) };
      },
      { leaders: [] as string[], members: [] as string[] },
    );

    const templeUpdateData = {
      'clan-checkbox': 'on',
      clan: '100',
      id: serverConstants.temple.groupId,
      key: serverConstants.temple.groupKey,
      name: serverConstants.temple.groupName,
      leaders: leaders.toString(),
      members: members.toString(),
      ...(serverConstants.temple.privateGroup === 'true'
        ? { 'private-group-checkbox': 'on' }
        : {}),
    } satisfies GroupUpdateRequest;

    console.log('Updating member list');

    // Sync our Temple page with the new member list
    await fetch(`${clientConstants.temple.baseUrl}/groups/edit.php`, {
      method: 'POST',
      body: new URLSearchParams(templeUpdateData),
    });
  }

  // --- INSERT INTO MYSQL ---
  try {
    const conn = await getDbConnection();

    // Example: clear table + reinsert members
    await conn.execute('DELETE FROM members');

    const insertPromises = body.clanMemberMaps.map((member) =>
      conn.execute(
        'INSERT INTO members (rsn, rank) VALUES (?, ?)',
        [member.rsn, member.rank]
      )
    );

    await Promise.all(insertPromises);
    await conn.end();
  } catch (err) {
    console.error('DB insert failed:', err);
    return NextResponse.json({ success: false, error: 'DB insert failed' }, { status: 500 });
  }

  await Promise.all([
    // Save the member list to the Vercel blob store to use later
    put('members.json', JSON.stringify(body.clanMemberMaps), {
      access: 'public',
    }),
    ...(updateTemple
      ? [
        // Check all players in the new member list
        fetch(`${clientConstants.publicUrl}/api/check-all-players`),
      ]
      : []),
  ]);

  return NextResponse.json({ success: true });
}
