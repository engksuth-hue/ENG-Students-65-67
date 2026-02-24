import type { YearRecord } from '../types'
import { formatNumber } from '../utils'

type CardProps = {
  title: string
  value: number
  hint?: string
  color: string
  icon: string
}

function Card(props: CardProps) {
  const { title, value, hint, color, icon } = props

  return (
    <div
      className="card summaryCard"
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      {/* Header */}
      <div className="summaryHeader">
        <span className="summaryIcon">{icon}</span>
        <span className="cardTitle">{title}</span>
      </div>

      {/* Value */}
      <div
        className="cardValue"
        style={{
          color,
        }}
      >
        {formatNumber(value)}
      </div>

      {/* Hint */}
      {hint && <div className="cardHint">{hint}</div>}
    </div>
  )
}

export function SummaryCards(props: { record: YearRecord }) {
  const r = props.record

  return (
    <div className="grid5 summaryGrid">
      <Card
        title="แผนการรับ"
        value={r.intake_plan}
        hint="เป้าหมายรับเข้า"
        color="#17cdc7"
        icon="📋"
      />

      <Card
        title="นศ.แรกเข้า"
        value={r.new_intake}
        hint="รับเข้าแล้ว/ยืนยันสิทธิ"
        color="#eb8f25"
        icon="🎓"
      />

      <Card
        title="จำนวนคงอยู่"
        value={r.retained}
        hint="ยังศึกษาอยู่"
        color="#059669"
        icon="👥"
      />

    </div>
  )
}