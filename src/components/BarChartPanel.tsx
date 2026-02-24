import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

import type { YearRecord } from '../types'
import { formatNumber } from '../utils'

/* ================================
   Color Theme (เลือดหมู-ขาว สุภาพ)
================================ */
const COLORS = {
  plan: '#0e56d2',     // แดงเข้ม
  new: '#f1f900',      // แดงสด
  retained: '#3fdd54', // ส้มอ่อน
  notOpen: '#c5710a',  // เทา
}

export function BarChartPanel(props: { records: YearRecord[] }) {
  const data = props.records.map((r) => ({
    year: String(r.year),
    plan: r.intake_plan,
    new: r.new_intake,
    retained: r.retained,
    notOpen: r.not_open,
    total: r.total,
  }))

  return (
    <div className="panel">
      {/* ================= Header ================= */}
      <div className="panelHeader">
        <div>
          <div className="panelTitle">
            📊 กราฟแท่ง: เปรียบเทียบปีการศึกษา 65–67
          </div>

          <div className="panelSubtitle">
            แผนรับเข้า / รับเข้าใหม่ / คงอยู่ / ยังไม่เปิดรับ (คน)
          </div>
        </div>
      </div>

      {/* ================= Chart ================= */}
      <div className="chartBox">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.1)"
            />

            {/* Axis */}
            <XAxis
              dataKey="year"
              tick={{ fontSize: 13 }}
              axisLine={false}
            />

            <YAxis
              tick={{ fontSize: 13 }}
              axisLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: 13,
              }}
              formatter={(v: number) => formatNumber(v)}
            />

            {/* Legend */}
            <Legend
              verticalAlign="top"
              height={40}
              iconType="circle"
            />

            {/* Bars */}
            <Bar
              dataKey="plan"
              name="แผนการรับ"
              fill={COLORS.plan}
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="new"
              name="นศ.แรกเข้า"
              fill={COLORS.new}
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="retained"
              name="จำนวนคงอยู่"
              fill={COLORS.retained}
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="notOpen"
              name="ยังไม่เปิดรับ"
              fill={COLORS.notOpen}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= Note ================= */}
      <div className="note">
        แก้ไขข้อมูลได้ที่{' '}
        <code>public/data/students_65_67.json</code>
        {' '}หรือกำหนดผ่าน{' '}
        <code>VITE_DATA_URL</code>
      </div>
    </div>
  )
}