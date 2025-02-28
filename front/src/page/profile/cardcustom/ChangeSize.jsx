const ChangeSize = ({ label, name, value, min, max, step, onChange }) => {
  return (
    <label>
      {label}:
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={parseFloat(value)}
        onChange={(e) =>
          onChange({ target: { name, value: `${e.target.value}rem` } })
        }
      />
      <input type="number" value={parseFloat(value)} readOnly />
    </label>
  );
};

export default ChangeSize;
