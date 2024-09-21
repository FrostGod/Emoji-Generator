import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log("Prompt:", prompt);

    // const input = {
    //   width: 856,
    //   height: 1156,
    //   prompt: prompt,
    //   output_format: "png",
    //   output_quality: 100,
    //   num_inference_steps: 25
    // };
    
    const input = {
      "width": 1024,
      "height": 1024,
      "prompt": "A Tok emoji of " + prompt,
      "refine": "no_refiner",
      "scheduler": "K_EULER",
      "lora_scale": 0.6,
      "num_outputs": 1,
      "guidance_scale": 7.5,
      "apply_watermark": false,
      "high_noise_frac": 0.8,
      "negative_prompt": "",
      "prompt_strength": 0.8,
      "num_inference_steps": 50
    }

    // {
      // "input": {
      //   "width": 1024,
      //   "height": 1024,
      //   "prompt": "prompt",
      //   "refine": "no_refiner",
      //   "scheduler": "K_EULER",
      //   "lora_scale": 0.6,
      //   "num_outputs": 1,
      //   "guidance_scale": 7.5,
      //   "apply_watermark": false,
      //   "high_noise_frac": 0.8,
      //   "negative_prompt": "",
      //   "prompt_strength": 0.8,
      //   "num_inference_steps": 50
      // }
    // }

    const output = await replicate.run(
      "bingbangboom-lab/flux-new-whimscape:2e8de10f217bc56da163a0204cf09f89995eaf643459014803fae79753183682",
      { input }
    );

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}