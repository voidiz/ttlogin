const matrixRegex = /^\[(\w),(\w)\]$/;

function isMatrixPage() {
  const tds = document.querySelectorAll("td");
  return [...tds.values()].some(
    (node) => node.innerText === "Matrix Authentication"
  );
}

function autoFill(matrix: Record<string, string>) {
  const ths = document.querySelectorAll("th");
  const thNodes = [...ths.values()].filter((node) =>
    matrixRegex.test(node.innerText)
  );

  thNodes.forEach((node) => {
    const match = node.innerText.match(matrixRegex);
    if (!match) {
      console.error(
        "Couldn't find cell label. This most likely means that the extension is broken."
      );
      return;
    }

    const [, letter, num] = match;
    const inputField = node.parentNode?.querySelector("input");
    if (!inputField) {
      console.error(
        "Couldn't find cell input. This most likely means that the extension is broken."
      );
      return;
    }

    const id = `${letter}${num}`;
    inputField.value = matrix[id];
  });
}

chrome.storage?.local.get(["matrix"], (result) => {
  if (!("matrix" in result) || !isMatrixPage()) {
    return;
  }

  autoFill(result.matrix);

  const submitButton = document.querySelector(
    "input[type='submit']"
  ) as HTMLButtonElement | null;
  submitButton?.click();
});

export {};
