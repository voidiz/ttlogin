import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Loading from "./Loading";

type MatrixValues = Record<string, string>;
type MatrixInputs = Record<string, HTMLInputElement | null>;

function Matrix() {
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    () =>
      [...Array(10).keys()].map((num) =>
        String.fromCharCode("A".charCodeAt(0) + num)
      ),
    []
  );

  const rows = useMemo(() => [...Array(7).keys()].map((num) => num + 1), []);

  const [currentMatrix, setCurrentMatrix] = useState<MatrixValues>(
    Object.fromEntries(
      columns.flatMap((letter) => rows.map((num) => [`${letter}${num}`, ""]))
    )
  );

  const inputsRef = useRef<MatrixInputs>({});

  const saveCell = useCallback(
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentMatrix((prevMatrix) => {
        const newMatrix = { ...prevMatrix };
        newMatrix[id] = e.target.value.toUpperCase();
        return newMatrix;
      });

      const [letter, num] = id;
      const letterIndex = letter.charCodeAt(0) - "A".charCodeAt(0);
      const nextLetterIndex = (letterIndex + 1) % columns.length;
      const nextLetter = String.fromCharCode(
        "A".charCodeAt(0) + nextLetterIndex
      );
      const nextNum =
        nextLetterIndex === 0 ? (+num + 1) % (rows.length + 1) : +num;
      const nextId = `${nextLetter}${nextNum}`;
      inputsRef.current[nextId]?.focus();
      inputsRef.current[nextId]?.select();
    },
    [columns, rows]
  );

  // Get saved matrix
  useEffect(() => {
    if (!chrome.storage) {
      setLoading(false);
    }

    chrome.storage?.local.get(["matrix"], (result) => {
      setLoading(false);
      if ("matrix" in result) {
        setCurrentMatrix(result.matrix);
      }
    });
  }, [columns, rows]);

  // Save matrix when we update locally
  useEffect(() => {
    chrome.storage?.local.set({
      matrix: currentMatrix,
    });
  }, [currentMatrix]);

  if (loading) {
    return (
      <div className="grid place-items-center h-48 w-96">
        <Loading />
      </div>
    );
  }

  return (
    <table className="table-auto border-spacing-0 text-center font-bold">
      <thead>
        <tr>
          <th></th>
          {columns.map((value) => (
            <th className="bg-black text-white" key={value}>
              {value}
            </th>
          ))}
        </tr>
      </thead>
      {rows.map((num) => (
        <tr key={num}>
          <th
            className={`p-0 m-0 text-white px-3 ${
              num % 2 === 0 ? "bg-gray-600" : "bg-black"
            }`}
          >
            {num}
          </th>
          {columns.map((letter) => {
            const id = `${letter}${num}`;
            return (
              <td key={letter} className="p-0 m-0">
                <input
                  ref={(e) => {
                    inputsRef.current[id] = e;
                  }}
                  onChange={saveCell(id)}
                  value={currentMatrix[id]}
                  className={`text-center w-8 border border-black ${
                    num % 2 === 0 ? "bg-white" : "bg-red-200"
                  }`}
                  type="text"
                />
              </td>
            );
          })}
        </tr>
      ))}
    </table>
  );
}

export default Matrix;
