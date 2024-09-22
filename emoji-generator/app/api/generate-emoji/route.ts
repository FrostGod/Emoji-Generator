import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt } = await request.json();
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    // Generate emoji using Replicate
    const output = await replicate.run(
      "bingbangboom-lab/flux-new-whimscape:2e8de10f217bc56da163a0204cf09f89995eaf643459014803fae79753183682",
      { input: { prompt, apply_watermark: false } }
    );

    if (!output || !Array.isArray(output) || typeof output[0] !== 'string') {
      throw new Error('Failed to generate emoji');
    }

    const imageUrl = output[0];

    // Add logging to check the imageUrl
    console.log('Generated image URL:', imageUrl);

    // Test if the image can be fetched
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    // Log Supabase client initialization
    console.log('Supabase client initialized');

    // Attempt to upload with more detailed error logging
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('emojis')
      .upload(`${userId}/${Date.now()}.png`, await imageResponse.blob());

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Failed to upload emoji to storage: ${uploadError.message}`);
    }

    // Get public URL of uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('emojis')
      .getPublicUrl(uploadData.path);

    // Add emoji data to the "emojis" table
    const { error: insertError } = await supabase
      .from('emojis')
      .insert({
        image_url: publicUrlData.publicUrl,
        prompt,
        creator_user_id: userId,
      });

    if (insertError) {
      throw new Error('Failed to insert emoji data');
    }

    return NextResponse.json({ success: true, imageUrl: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Detailed error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to generate or store emoji', details: errorMessage }, { status: 500 });
  }
}