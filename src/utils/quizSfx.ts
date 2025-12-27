// Utility for playing Quiz SFX via ElevenLabs
const SFX_CACHE: Record<string, string> = {};

export async function playSfx(type: "correct" | "wrong" | "result") {
  try {
    // Check cache first
    if (SFX_CACHE[type]) {
      const audio = new Audio(SFX_CACHE[type]);
      await audio.play();
      return;
    }

    // Generate & play
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quiz-sfx`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ type }),
      }
    );

    if (!response.ok) {
      console.error("Failed to generate SFX:", response.status);
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    SFX_CACHE[type] = audioUrl; // Cache for next use

    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error("Error playing SFX:", error);
  }
}
