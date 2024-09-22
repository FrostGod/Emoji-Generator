import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  // Check if user exists in the profiles table
  const { data: existingUser, error: fetchError } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user:', fetchError);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }

  if (!existingUser) {
    // User doesn't exist, create a new entry
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ user_id: userId });

    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}