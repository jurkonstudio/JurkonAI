// Penyedia AI BELUM terhubung. Tidak ada jawaban palsu yang dihasilkan di sini.
// Kontrak untuk backend aman (Tahap integrasi AI): reply(messages) -> Promise<{ text }>.
// Frontend tidak boleh memuat API key; panggil endpoint backend milikmu sendiri.
export class AINotConfiguredError extends Error {
  constructor() { super('Layanan AI belum dikonfigurasi'); this.code = 'NOT_CONFIGURED'; }
}
export const AIService = {
  configured: false,
  async reply() { throw new AINotConfiguredError(); }
};
