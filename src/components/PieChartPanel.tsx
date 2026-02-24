import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'

import type { YearRecord } from '../types'
import { formatNumber } from '../utils'

/* ================================
   Theme Colors (No Black)
================================ */
const COLORS = [
  '#2bff2b', // แดงเลือดหมูเข้ม
  '#454bc4', // แดงนุ่ม
  '#ffae00', // ชมพูอ่อน
]

export function PieChartPanel(props: { record: YearRecord }) {
  const r = props.record

  const data = [
    { name: 'นศ.แรกเข้า', value: r.new_intake },
    { name: 'จำนวนคงอยู่', value: r.retained },
    { name: 'ยังไม่เปิดรับ', value: r.not_open },
  ].filter((d) => d.value > 0)

  return (
    <div className="panel piePanel">
      {/* ================= Header ================= */}
      <div className="panelHeader">
        <div>
          <div className="panelTitle">
            กราฟวงกลม: สัดส่วนภาพรวม (ปี {r.year})
          </div>

          <div className="panelSubtitle">
            แจกแจงตามสถานะ (คน)
          </div>
        </div>
      </div>

      {/* ================= Chart ================= */}
      <div className="chartBox pieBox">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={3}
              labelLine={false}
              label={({ name, value }) =>
                `${name}: ${formatNumber(value)}`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip
              formatter={(v: number) => formatNumber(v)}
              contentStyle={{
                background: '#00aaff',
                borderRadius: '10px',
                border: '1px solid #c3790a',
                color: '#5223a2',
                fontSize: '13px',
              }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{
                fontSize: '13px',
                color: '#ebff11',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}