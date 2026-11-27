document.addEventListener("DOMContentLoaded", () => {
  const defaultRoutines = [
    { id: 1, title: "내일 첫 강의 알람 & 시간표 확인하기", time: "2분", done: false },
    { id: 2, title: "따뜻한 물 한 잔 천천히 마시기", time: "1분", done: false },
    { id: 3, title: "방 형광등 끄고 은은한 조명 켜기", time: "1분", done: false },
    { id: 4, title: "침대 밖 책상에 휴대폰 충전기 꽂아두기", time: "1분", done: false },
    { id: 5, title: "목·어깨 가볍게 스트레칭하기", time: "5분", done: false }
  ];

  let routines = JSON.parse(localStorage.getItem("somnia_routines")) || defaultRoutines;

  const routineListEl = document.getElementById("routineList");
  const progressTextEl = document.getElementById("progressText");
  const progressFillEl = document.getElementById("progressFill");
  const saveMessageEl = document.getElementById("saveMessage");
  const targetSleepTimeEl = document.getElementById("targetSleepTime");

  const savedTargetTime = localStorage.getItem("somnia_target_sleep");
  if (savedTargetTime) {
    targetSleepTimeEl.textContent = savedTargetTime;
  }

  function saveRoutines() {
    localStorage.setItem("somnia_routines", JSON.stringify(routines));
  }

  function updateProgress() {
    const total = routines.length;
    const completed = routines.filter((r) => r.done).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressTextEl.textContent = `${percent}% (${completed}/${total})`;
    progressFillEl.style.width = `${percent}%`;
  }

  function renderRoutines() {
    routineListEl.innerHTML = "";

    routines.forEach((item) => {
      const li = document.createElement("li");
      li.className = `routine-item ${item.done ? "done" : ""}`;
      li.innerHTML = `
        <div class="routine-left">
          <input type="checkbox" ${item.done ? "checked" : ""} />
          <span>${item.title}</span>
        </div>
        <div class="routine-right">
          <span class="badge">${item.time}</span>
          <button type="button" class="delete-btn" title="루틴 삭제">✕</button>
        </div>
      `;

      li.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) return;
        item.done = !item.done;
        saveRoutines();
        renderRoutines();
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        routines = routines.filter((r) => r.id !== item.id);
        saveRoutines();
        renderRoutines();
      });

      routineListEl.appendChild(li);
    });

    updateProgress();
  }

  document.getElementById("addRoutineForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const inputEl = document.getElementById("newRoutineInput");
    const timeEl = document.getElementById("newRoutineTime");
    const title = inputEl.value.trim();

    if (!title) return;

    routines.push({
      id: Date.now(),
      title,
      time: timeEl.value,
      done: false
    });

    saveRoutines();
    renderRoutines();
    inputEl.value = "";
  });

  document.getElementById("completeDayBtn").addEventListener("click", () => {
    const total = routines.length;
    const completed = routines.filter((r) => r.done).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const today = new Date().toISOString().slice(0, 10);
    const records = JSON.parse(localStorage.getItem("somnia_records")) || {};
    records[today] = percent;
    localStorage.setItem("somnia_records", JSON.stringify(records));

    saveMessageEl.textContent = `✓ ${today} 달성률(${percent}%)이 주간 기록에 저장되었어요!`;
  });

  renderRoutines();
});