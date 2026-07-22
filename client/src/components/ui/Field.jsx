const Field = ({ label, error, children }) => (
  <div className="w-full">
    <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1 break-words">{error}</p>}
  </div>
);

export default Field;