export default function getCookie(name: string): string {
  const cookieValue = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  const cookie = cookieValue?.pop();
  return cookie ? cookie : "";
}
