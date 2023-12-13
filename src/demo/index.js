const wrapperElement = document.querySelector(".clip-path-wrapper");
const dropContainer = document.getElementById("dropContainer");
const fileInput = document.getElementById("images");

const timeElement = document.querySelector("#time");

const gapElement = document.querySelector("#gap");
const gapValue = document.querySelector("#gapValue");

const distanceElement = document.querySelector("#distance");
const distanceValue = document.querySelector("#distanceValue");

const previewImageElement = document.querySelector("#previewImg");
const previewSvgElement = document.querySelector("#previewSvg");

const offsetXElement = document.querySelector("#offsetX");
const offsetXvalue = document.querySelector("#offsetValueX");
const shiftYElement = document.querySelector("#offsetY");
const offsetYvalue = document.querySelector("#offsetValueY");
const resultElement = document.querySelector("#result");

const updateControlValues = () => {
  gapValue.textContent = `${gapElement.value}px`;
  distanceValue.textContent = `${distanceElement.value}px`;
  offsetXvalue.textContent = `${offsetXElement.value}px`;
  offsetYvalue.textContent = `${shiftYElement.value}px`;
};

const enableControls = () => {
  gapElement.removeAttribute("disabled");
  distanceElement.removeAttribute("disabled");
  offsetXElement.removeAttribute("disabled");
  shiftYElement.removeAttribute("disabled");
  resultElement.removeAttribute("disabled");
};

const disableControls = () => {
  gapElement.setAttribute("disabled", "disabled");
  distanceElement.setAttribute("disabled", "disabled");
  offsetXElement.setAttribute("disabled", "disabled");
  shiftYElement.setAttribute("disabled", "disabled");
  resultElement.setAttribute("disabled", "disabled");
  resultElement.textContent = "";
};

const generatePath = () => {
  updateControlValues();
  disableControls();
  timeElement.textContent = "Processing...";
  wrapperElement.classList.add("busy");
  wrapperElement.scrollTo(0, 0);
  previewSvgElement.innerHTML = "";

  setTimeout(async () => {
    const { clipPath, time } = await window.autoClipPath(
      previewImageElement,
      {
        width: previewImageElement.clientWidth,
        height: previewImageElement.clientHeight,
      },
      {
        shift: {
          x: Number(offsetXElement.value),
          y: Number(shiftYElement.value),
        },
        gap: Number(gapElement.value),
        distance: Number(distanceElement.value),
      },
    );

    wrapperElement.classList.remove("busy");
    timeElement.innerHTML = `Done in <b>${time}ms</b> | ${clipPath.length} points`;

    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    let points = "";

    for (const coordinates of clipPath) {
      points += `${coordinates.x},${coordinates.y} `;

      const handle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );

      handle.setAttribute("cx", coordinates.x);
      handle.setAttribute("cy", coordinates.y);
      handle.setAttribute("r", 4);

      previewSvgElement.appendChild(handle);
    }

    polygon.setAttribute("points", points);

    previewSvgElement.appendChild(polygon);

    //
    previewSvgElement.setAttribute("width", previewImageElement.clientWidth);
    previewSvgElement.setAttribute("height", previewImageElement.clientHeight);

    //
    const cssClipPathPoints = clipPath
      .map((point) => `${point.x}px ${point.y}px`)
      .join(", ");

    resultElement.textContent = `clip-path: polygon(${cssClipPathPoints})`;

    enableControls();
  }, 100);
};

dropContainer.addEventListener(
  "dragover",
  (e) => {
    e.preventDefault();
  },
  false,
);

dropContainer.addEventListener("dragenter", () => {
  dropContainer.classList.add("drag-active");
});

dropContainer.addEventListener("dragleave", () => {
  dropContainer.classList.remove("drag-active");
});

dropContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  dropContainer.classList.remove("drag-active");
  fileInput.files = e.dataTransfer.files;
  fileInput.onchange();
});

fileInput.onchange = function () {
  const src = URL.createObjectURL(this.files[0]);

  previewImageElement.onload = function () {
    generatePath();
  };

  previewImageElement.src = src;
};

gapElement.addEventListener("change", generatePath);
distanceElement.addEventListener("change", generatePath);
offsetXElement.addEventListener("change", generatePath);
shiftYElement.addEventListener("change", generatePath);

updateControlValues();
