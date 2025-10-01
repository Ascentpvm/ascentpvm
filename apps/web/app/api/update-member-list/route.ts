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

  // Create a new update record
  const { data: updateRecord, error: updateError } = await supabase
    .from('clan_updates')
    .insert({
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (updateError || !updateRecord) {
    console.error('Error creating update record:', updateError);
    return NextResponse.json(
      { success: false, error: 'Failed to create update record' },
      { status: 500 }
    );
  }

  // Get all existing members to preserve history
  const { data: existingMembers } = await supabase
    .from('clan_members')
    .select('rsn, rank, joined_date, last_left');

  const existingMemberMap = new Map(
    (existingMembers as { rsn: string; rank: string; joined_date: string; last_left: string | null }[] | null)?.map(m => [m.rsn.toLowerCase(), m]) ?? []
  );

  const payloadRsns = new Set(memberList.map(m => m.rsn.toLowerCase()));
  const currentTime = new Date().toISOString();

  // Delete all existing records (we'll reinsert with updated status)
  await supabase.from('clan_members').delete().neq('rsn', '');

  // Insert members from payload as active
  const { error: supabaseError } = await supabase
    .from('clan_members')
    .insert(
      memberList.map(member => {
        const existing = existingMemberMap.get(member.rsn.toLowerCase());
        return {
          rsn: member.rsn,
          rank: member.rank,
          joined_date: member.joinedDate,
          updated_at: currentTime,
          update_id: updateRecord.id as string,
          is_active: true,
          last_left: existing?.last_left ?? null,
        };
      })
    );

  // Insert members who left as inactive
  const membersWhoLeft = Array.from(existingMemberMap.entries())
    .filter(([rsn]) => !payloadRsns.has(rsn))
    .map(([, existing]) => ({
      rsn: existing.rsn,
      rank: existing.rank,
      joined_date: existing.joined_date,
      updated_at: currentTime,
      update_id: updateRecord.id as string,
      is_active: false,
      last_left: existing.last_left ?? currentTime,
    }));

  if (membersWhoLeft.length > 0) {
    const { error: inactiveError } = await supabase
      .from('clan_members')
      .insert(membersWhoLeft);

    if (inactiveError) {
      console.error('Error saving inactive members:', inactiveError);
    }
  }

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
