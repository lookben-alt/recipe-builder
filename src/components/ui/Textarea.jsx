export default function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  helpText,
  error,
  className = ''
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
