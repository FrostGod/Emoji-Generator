export async function downloadEmoji(imageUrl: string, prompt: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // Use the prompt as the filename, but remove any characters that aren't allowed in filenames
    const safeName = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `emoji_${safeName}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading emoji:', error);
  }
}