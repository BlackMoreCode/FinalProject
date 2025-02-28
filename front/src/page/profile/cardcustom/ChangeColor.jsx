const ChangeColor = ({ label, name, value, onChange }) => {
  return (
    <label>
      {label}:
      <input type="color" name={name} value={value} onChange={onChange} />
    </label>
  );
};

export default ChangeColor;
