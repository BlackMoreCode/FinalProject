const ChangeFont = ({ label, name, value, onChange }) => {
  return (
    <label>
      {label}:
      <select name={name} value={value} onChange={onChange}>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Courier New, monospace">Courier New</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Tahoma, sans-serif">Tahoma</option>
      </select>
    </label>
  );
};

export default ChangeFont;
