export function scrollToSection(
  section: string,
) {
  const el = document.getElementById(section);
  if (el) {
    const topOffset = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: topOffset - 100,
      behavior: "smooth",
    });
  } else {
    window.location.href = `/#${section}`;
  }
}