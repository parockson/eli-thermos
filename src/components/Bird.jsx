export default function Bird({ x, y, isDragging }) {
  return (
    <g transform={`translate(${x - 15}, ${y - 15})`}
       className={isDragging ? "bird dragging" : "bird"}>
      <circle cx="15" cy="15" r="12" fill="yellow" stroke="black" strokeWidth="2"/>
      <circle cx="10" cy="12" r="3" fill="black"/>
      <polygon points="22,15 30,18 22,21" fill="orange"/>
    </g>
  );
}
