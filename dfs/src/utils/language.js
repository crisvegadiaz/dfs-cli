/**
 * Obtiene el código de idioma del sistema (p. ej., 'en', 'es').
 * Comprueba las variables de entorno comunes como LANG, LC_ALL y LC_MESSAGES.
 * Maneja casos especiales como la locale 'C' en Arch Linux.
 *
 * @returns {string} El código de idioma de dos letras, con 'en' como valor predeterminado.
 */

export default function language() {
  const langEnv =
    process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES;

  if (langEnv) {
    const langCode = langEnv.split(/[._]/)[0];
    if (langCode && langCode.toLowerCase() !== "c") {
      return langCode.toLowerCase();
    }
  }
  return "en";
}
