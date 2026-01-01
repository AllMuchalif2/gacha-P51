// UI Module - DOM Manipulation and Rendering
const colors = [
  "bg-red-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
];

class UI {
  constructor() {
    this.elements = {
      studentCount: document.getElementById("studentCount"),
      hasilKelompok: document.getElementById("hasilKelompok"),
      daftarAnggota: document.getElementById("daftarAnggota"),
      modalInput: document.getElementById("modalInput"),
      namaAnggotaInput: document.getElementById("namaAnggotaInput"),
      simpanButton: document.getElementById("simpanButton"),
      exportBtn: document.getElementById("exportBtn"),
      modeLabel: document.getElementById("modeLabel"),
      jumlahInput: document.getElementById("jumlahInput"),
    };
  }

  // Update student count display
  updateAnggotaCount(count) {
    this.elements.studentCount.textContent = `Total Anggota: ${count}`;
  }

  // Render table of anggota
  renderTabelAnggota(anggotaList, onEdit, onDelete) {
    this.elements.daftarAnggota.innerHTML = anggotaList
      .map(
        (anggota, index) => `
        <tr>
          <td class="border px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">${
            index + 1
          }</td>
          <td class="border px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">${
            anggota.nama
          }</td>
          <td class="border px-2 sm:px-4 py-1.5 sm:py-2">
            <div class="flex gap-1 sm:gap-2 justify-center flex-wrap">
              <button onclick="window.app.editAnggota(${
                anggota.id
              })" class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">Edit</button>
              <button onclick="window.app.hapusAnggota(${
                anggota.id
              })" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">Hapus</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  // Render kelompok cards
  renderKelompok(kelompokData, skipAnimation = false) {
    const wrap = this.elements.hasilKelompok;
    wrap.innerHTML = "";

    if (kelompokData.length === 0) {
      wrap.innerHTML =
        '<p class="text-center col-span-3 text-gray-500 text-sm">Belum ada kelompok yang dibuat</p>';
      return;
    }

    // Dynamic grid layout based on number of kelompok
    let gridClass = "";
    const count = kelompokData.length;
    if (count === 1) {
      gridClass = "grid-cols-1 max-w-md mx-auto";
    } else if (count === 2) {
      gridClass = "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";
    } else if (count === 3) {
      gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    } else {
      gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }

    wrap.className = `grid gap-3 sm:gap-4 mt-3 sm:mt-4 ${gridClass}`;

    // Animation variants
    const animations = [
      "slide-in-left",
      "slide-in-right",
      "slide-in-bottom",
      "fade-in",
    ];

    kelompokData.forEach((group, idx) => {
      const renderCard = () => {
        const color = colors[idx % colors.length];
        const animationClass = skipAnimation
          ? ""
          : animations[idx % animations.length];
        const div = document.createElement("div");
        div.className = `${animationClass} p-3 sm:p-4 rounded-lg shadow-[5px_7px_0_rgb(15,23,42,1)] ${color} hover:shadow-[7px_9px_0_rgb(15,23,42,1)] transition-all duration-300`;
        div.innerHTML = `
          <h3 class="font-semibold text-base sm:text-lg mb-2">Kelompok ${
            idx + 1
          } <span class="text-xs sm:text-sm font-normal">(${
          group.length
        } orang)</span></h3>
          <ul class="space-y-1.5 sm:space-y-2 min-h-[40px]" 
              id="group-${idx}" 
              ondragover="event.preventDefault(); event.currentTarget.classList.add('bg-gray-200')" 
              ondragleave="event.currentTarget.classList.remove('bg-gray-200')"
              ondrop="window.app.onDrop(event, ${idx})">
            ${group
              .map(
                (anggota, studentIdx) => `
              <li draggable="true" 
                  ondragstart="window.app.onDragStart(event, ${studentIdx}, ${idx})"
                  ondragend="event.currentTarget.classList.remove('dragging')"
                  class="p-2 bg-white rounded-md border cursor-move hover:shadow-md transition-all text-xs sm:text-sm">
                ${anggota.nama}
              </li>
            `
              )
              .join("")}
          </ul>
        `;
        wrap.appendChild(div);
      };

      if (skipAnimation) {
        // Render immediately without animation
        renderCard();
      } else {
        // Render with staggered animation
        setTimeout(renderCard, idx * 200);
      }
    });

    if (!skipAnimation) {
      setTimeout(() => {
        this.elements.exportBtn.disabled = false;
      }, kelompokData.length * 200 + 300);
    } else {
      this.elements.exportBtn.disabled = false;
    }
  }

  // Toggle modal
  toggleModal() {
    this.elements.modalInput.classList.toggle("hidden");
    if (!this.elements.modalInput.classList.contains("hidden")) {
      this.elements.namaAnggotaInput.focus();
    }
  }

  // Get input value
  getInputValue() {
    return this.elements.namaAnggotaInput.value.trim();
  }

  // Clear input
  clearInput() {
    this.elements.namaAnggotaInput.value = "";
  }

  // Set input value
  setInputValue(value) {
    this.elements.namaAnggotaInput.value = value;
  }

  // Update button text
  updateButtonText(text) {
    this.elements.simpanButton.textContent = text;
  }

  // Toggle mode label
  updateModeLabel(isModeJumlah) {
    if (isModeJumlah) {
      this.elements.modeLabel.textContent = "Mode: Jumlah Kelompok";
      this.elements.jumlahInput.placeholder = "Jumlah Kelompok";
    } else {
      this.elements.modeLabel.textContent = "Mode: Jumlah Anggota";
      this.elements.jumlahInput.placeholder = "Jumlah Anggota per Kelompok";
    }
  }

  // Get jumlah input value
  getJumlahInput() {
    return parseInt(this.elements.jumlahInput.value);
  }

  // Show toast notification
  showToast(message, type = "info") {
    // Simple alert for now, can be enhanced with custom toast
    alert(message);
  }

  // Enable/disable export button
  setExportButtonState(enabled) {
    this.elements.exportBtn.disabled = !enabled;
  }
}

export default UI;
