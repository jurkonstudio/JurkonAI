// MOCK: layanan simulasi. Ganti dengan pemanggilan backend aman pada Tahap 3.
// Kontrak: reply(history) -> Promise<{text, simulated:true}>
export const MockAIService = {
  async reply(history) {
    await new Promise(r => setTimeout(r, 900));
    const last = history[history.length - 1]?.text ?? '';
    if (/error/i.test(last)) throw new Error('Simulasi error: layanan mock sengaja gagal.');
    if (/kode|code|js|python/i.test(last))
      return { simulated: true, text: 'Ini contoh kode simulasi:\n```js\nconsole.log("Halo dari Jurkon AI");\n```\nTidak ada model nyata yang menulis ini.' };
    return { simulated: true, text: `Ini balasan **simulasi** untuk: "${last.slice(0, 80)}"\n- Prototipe belum terhubung ke model AI\n- Backend aman dibutuhkan pada tahap berikutnya` };
  }
};
