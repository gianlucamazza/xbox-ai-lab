const dialog = document.querySelector<HTMLDialogElement>("#search-dialog")!;
const input = document.querySelector<HTMLInputElement>("#search-input")!;
const results = document.querySelector<HTMLDivElement>("#search-results")!;
let index: { title: string; url: string; text: string }[] = [];
async function openSearch() {
  dialog.showModal();
  input.focus();
  if (!index.length) {
    try {
      const response = await fetch("/search-index.json");
      if (!response.ok) throw new Error("Search unavailable");
      index = await response.json();
      update();
    } catch {
      results.textContent =
        "Search is unavailable. Browse the Documentation page.";
    }
  }
}
function update() {
  const q = input.value.toLowerCase().trim();
  const matches = index
    .filter((x) => !q || (x.title + " " + x.text).toLowerCase().includes(q))
    .slice(0, 15);
  results.replaceChildren();
  for (const x of matches) {
    const a = document.createElement("a");
    a.href = x.url;
    const strong = document.createElement("strong");
    strong.textContent = x.title;
    const small = document.createElement("span");
    small.textContent = x.text.slice(0, 120);
    a.append(strong, small);
    results.append(a);
  }
  document.querySelector("#search-count")!.textContent = matches.length
    ? `${matches.length} results`
    : "No matches. Try “CPU” or “setup”.";
}
document
  .querySelector("#open-search")!
  .addEventListener("click", () => void openSearch());
document
  .querySelector("#close-search")!
  .addEventListener("click", () => dialog.close());
input.addEventListener("input", update);
document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    !dialog.open &&
    !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
  ) {
    e.preventDefault();
    void openSearch();
  }
});
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
const menu = document.querySelector("#menu-toggle")!;
menu.addEventListener("click", () => {
  const nav = document.querySelector<HTMLElement>("#mobile-nav")!;
  nav.hidden = !nav.hidden;
  menu.setAttribute("aria-expanded", String(!nav.hidden));
});
for (const button of document.querySelectorAll<HTMLButtonElement>(".copy"))
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        button.closest(".codebox")!.querySelector("code")!.textContent ?? "",
      );
      button.textContent = "Copied";
      document.querySelector("#copy-status")!.textContent =
        "Code copied to clipboard";
      setTimeout(() => (button.textContent = "Copy code"), 1800);
    } catch {
      button.textContent = "Select code to copy";
    }
  });
