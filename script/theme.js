// 페이지가 그려지기 전 즉시 테마 적용 (깜빡임 방지 & 기본값 yellow 보장)
const allowedThemes = ["yellow", "red", "navy"];
const rawSavedTheme = localStorage.getItem("deepsleep_theme");
const initialTheme = allowedThemes.includes(rawSavedTheme) ? rawSavedTheme : "yellow";
document.documentElement.setAttribute("data-theme", initialTheme);

// DOM 로드 후 버튼 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  const themeBtns = document.querySelectorAll(".theme-btn");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("deepsleep_theme", theme);
    themeBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.setTheme === theme);
    });
  }

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.setTheme));
  });

  applyTheme(initialTheme);
});