/**
 * oneliner.js — Thuật toán tạo one-liner từ BrandScript data
 * Algorithm từ SPEC_BRANDSCRIPT.md:
 *
 * "Hầu hết [khách hàng ngành {business_type}] đều gặp phải: [{external_problem} first sentence, lowercase].
 * {business_name} giúp bạn [{customer_want} first sentence, lowercase].
 * Để bạn [{success} first sentence, lowercase]."
 *
 * Truncate each part tại 80 chars + "…"
 */

const MAX_LEN = 80;

/**
 * Lấy câu đầu tiên của một đoạn text (kết thúc bởi . ! ? hoặc hết string)
 * Chuyển về lowercase, trim whitespace.
 * @param {string} text
 * @returns {string}
 */
function firstSentence(text) {
  if (!text || typeof text !== "string") return "";
  // Lấy câu đầu tiên: tách theo . ! ?
  const match = text.match(/^[^.!?]+[.!?]?/);
  const sentence = match ? match[0] : text;
  return sentence.trim().toLowerCase().replace(/[.!?]+$/, "");
}

/**
 * Truncate text nếu vượt quá maxLen, thêm "…"
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(text, maxLen = MAX_LEN) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "…";
}

/**
 * Tạo one-liner BrandScript từ data
 * @param {object} data — BrandScript data object
 * @returns {string|null} — one-liner string, hoặc null nếu thiếu fields bắt buộc
 */
export function generateOneLiner(data) {
  if (!data) return null;

  const { business_name, business_type, customer_want, external_problem, success } = data;

  // Kiểm tra các fields bắt buộc
  if (!business_name || !business_type || !customer_want || !external_problem || !success) {
    return null;
  }

  const problemPart = truncate(firstSentence(external_problem));
  const wantPart = truncate(firstSentence(customer_want));
  const successPart = truncate(firstSentence(success));

  const businessTypeLower = business_type.trim().toLowerCase();

  return (
    `Hầu hết khách hàng ngành ${businessTypeLower} đều gặp phải: ${problemPart}. ` +
    `${business_name.trim()} giúp bạn ${wantPart}. ` +
    `Để bạn ${successPart}.`
  );
}

export default generateOneLiner;
