import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { clientConstants } from '@/config/constants.client';
import { GroupUpdateRequest } from '@/app/schemas/temple-api';
import { serverConstants } from '@/config/constants.server';
import { ClanExport, ClanMemberList } from '@/app/schemas/inactivity-checker';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const updateTemple =
    request.nextUrl.searchParams.get('updateTemple') ?? 'true';
  const requestBody = await request.json() as unknown;
  
  // Try to parse as direct member list array first, then fall back to ClanExport format
  let memberList;
  try {
    memberList = ClanMemberList.parse(requestBody);
  } catch {
    const body = ClanExport.parse(requestBody);
    memberList = body.clanMemberMaps;
  }

  if (updateTemple === 'true') {
    const { members, leaders } = memberList.reduce(
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

  // Save members to Supabase
  console.log('Saving member list to Supabase');

  // Delete all existing members first
  await supabase.from('clan_members').delete().neq('rsn', '');

  // Generate a unique ID for this batch update
  const updateId = crypto.randomUUID();

  // Insert new member list
  const { error: supabaseError } = await supabase
    .from('clan_members')
    .insert(
      memberList.map(member => ({
        rsn: member.rsn,
        rank: member.rank,
        joined_date: member.joinedDate,
        updated_at: new Date().toISOString(),
        update_id: updateId,
      }))
    );
    

  if (supabaseError) {
    console.error('Error saving to Supabase:', supabaseError);
    return NextResponse.json(
      { success: false, error: 'Failed to save to database' },
      { status: 500 }
    );
  }

  await Promise.all([
    // Save the member list to the Vercel blob store to use later
    put('members.json', JSON.stringify(memberList), {
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
