import React from 'react'
export type TabKey = 'overview' | 'departments'

export function Tabs(props: { value: TabKey; onChange: (k: TabKey) => void }) {
  const { value, onChange } = props
  return (
    <div className="tabs">
      <button className={value === 'overview' ? 'tab active' : 'tab'} onClick={() => onChange('overview')}>
        ภาพรวม
      </button>
      <button className={value === 'departments' ? 'tab active' : 'tab'} onClick={() => onChange('departments')}>
        รายสาขา (ครบ)
      </button>
    </div>
  )
}
