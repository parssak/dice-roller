export default function isClient(): boolean {
  try {
    return typeof window !== "undefined" && !!window.document;
  } catch (e) {
    return false;
  }
}
