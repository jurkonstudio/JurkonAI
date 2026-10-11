// MOCK. Kontrak untuk backend nyata (Tahap 3): reply(messages) -> Promise<{ text, simulated }>.
export const AIService = {
  async reply(history) {
    await new Promise(r => setTimeout(r, 900));
    const last = history[history.length - 1]?.text ?? '';
    if (/error/i.test(last)) throw new Error('Simulasi error: layanan mock sengaja gagal.');
    if (/kode|code|js|python/i.test(last)) return { simulated: true, text: 'Ini contoh kode simulasi:\n```js\nconsole.log("Halo dari Jurkon AI");\n```\nTidak ada model nyata yang menulis ini.' };
    return { simulated: true, text: `Ini balasan **simulasi** untuk: "${last.slice(0, 80)}"\n- Prototipe belum terhubung ke model AI\n- Backend aman dibutuhkan pada tahap berikutnya` };
  }
};
