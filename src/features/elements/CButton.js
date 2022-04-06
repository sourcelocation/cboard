export function CButton({ title, filled, width, height, style, onClick }) {
  return <button
    onClick={
      onClick} 
      style={{
        borderRadius: `${height / 2}px`,
        height: `${height}px`,
        backgroundColor: filled ? '#7079FF' : 'white',
        border: filled ? 'none' : 'solid',
        borderColor: '#7079FF',
        color: filled ? 'white' : '#7079FF',
        width,
        cursor: 'pointer',
        ...style
      }}>
    {title}
  </button>
}