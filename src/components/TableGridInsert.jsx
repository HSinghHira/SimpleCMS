import React, { useState, useRef, useEffect } from "react";
export const TableGridInsert = ({
  editor,
  onClose
}) => {
  const [hoveredRows, setHoveredRows] = useState(0);
  const [hoveredCols, setHoveredCols] = useState(0);
  const containerRef = useRef(null);
  const maxRows = 8;
  const maxCols = 8;
  useEffect(() => {
    const handleMouseLeave = e => {
      if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
        setHoveredRows(0);
        setHoveredCols(0);
        onClose?.();
      }
    };
    const el = containerRef.current;
    el?.addEventListener("mouseleave", handleMouseLeave);
    return () => el?.removeEventListener("mouseleave", handleMouseLeave);
  }, [onClose]);
  const handleMouseEnter = (row, col) => {
    setHoveredRows(row + 1);
    setHoveredCols(col + 1);
  };
  const handleClick = (row, col) => {
    editor.chain().focus().insertTable({
      rows: row + 1,
      cols: col + 1,
      withHeaderRow: true
    }).run();
    onClose?.();
  };
  return <div ref={containerRef}>
      <div className="table-grid">
        {Array.from({
        length: maxRows
      }, (_, row) => Array.from({
        length: maxCols
      }, (_, col) => {
        const isHovered = row < hoveredRows && col < hoveredCols;
        return <div key={`${row}-${col}`} className={`table-grid-cell ${isHovered ? "hovered" : ""}`} onMouseEnter={() => handleMouseEnter(row, col)} onMouseDown={() => handleClick(row, col)} />;
      }))}
      </div>

      <div className="table-grid-hint">
        {hoveredRows > 0 && hoveredCols > 0 ? `${hoveredRows} × ${hoveredCols} Table` : "Choose table size"}
      </div>
    </div>;
};