type Props = {
  years: number[]
  value: number
  onChange: (y: number) => void
}

export function YearSelector({ years, value, onChange }: Props) {
  return (
    <div className="selectRow yearSelector">
      <label className="label">ปีการศึกษา</label>

      <div className="selectWrapper">
        <select
          className="select yearSelect"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* ลูกศรตกแต่ง */}
        <span className="selectArrow">▼</span>
      </div>
    </div>
  )
}