import { useMemo, useState } from 'react'
import type { DepartmentRow, YearRecord } from '../types'
import { formatNumber, safeLower } from '../utils'
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

/* =========================
   Color Theme (Maroon Soft)
========================= */
const COLORS = {
  new: '#037ff3',       // เลือดหมูเข้ม
  retained: '#00b144',  // แดงนุ่ม
  notOpen: '#cb2f51',   // ชมพูอ่อน
}

/* =========================
   Types
========================= */
type SortKey = keyof Pick<
  DepartmentRow,
  'department' | 'intake_plan' | 'new_intake' | 'retained' | 'not_open' | 'total'
>

/* =========================
   Utils
========================= */
function sortRows(
  rows: DepartmentRow[],
  key: SortKey,
  dir: 'asc' | 'desc',
): DepartmentRow[] {
  const m = dir === 'asc' ? 1 : -1

  return [...rows].sort((a, b) => {
    if (key === 'department') {
      return a.department.localeCompare(b.department) * m
    }
    return (a[key] - b[key]) * m
  })
}

/* =========================
   Main Component
========================= */
export function DepartmentDashboard(props: { record: YearRecord }) {
  const [q, setQ] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('total')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  /* =========================
     Filter + Sort
  ========================= */
  const filtered = useMemo(() => {
    const rows = props.record.by_department ?? []
    const qq = safeLower(q.trim())

    const out = qq
      ? rows.filter((r) => safeLower(r.department).includes(qq))
      : rows

    return sortRows(out, sortKey, dir)
  }, [props.record.by_department, q, sortKey, dir])

  /* =========================
     Chart Data
  ========================= */
  const chartData = useMemo(
    () =>
      filtered.map((r) => ({
        department: r.department,
        new: r.new_intake,
        retained: r.retained,
        notOpen: r.not_open,
      })),
    [filtered],
  )

  /* =========================
     Summary
  ========================= */
  const sum = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        acc.intake_plan += r.intake_plan
        acc.new_intake += r.new_intake
        acc.retained += r.retained
        acc.not_open += r.not_open
        acc.total += r.total
        return acc
      },
      {
        intake_plan: 0,
        new_intake: 0,
        retained: 0,
        not_open: 0,
        total: 0,
      },
    )
  }, [filtered])

  /* =========================
     Sort Toggle
  ========================= */
  function toggleSort(k: SortKey) {
    if (k === sortKey) {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(k)
      setDir(k === 'department' ? 'asc' : 'desc')
    }
  }

  /* =========================
     Render
  ========================= */
  return (
    <div className="stack">
      {/* ================= TABLE ================= */}
      <div className="panel softPanel">
        <div className="panelHeader">
          <div>
            <div className="panelTitle">
              รายสาขา (ปี {props.record.year})
            </div>
            <div className="panelSubtitle">
              ค้นหา • จัดเรียง • สรุปอัตโนมัติ
            </div>
          </div>

          <div className="searchBox">
            <input
              className="search softInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="🔍 ค้นหาชื่อสาขา..."
            />
          </div>
        </div>

        <div className="tableWrap">
          <table className="table softTable">
            <thead>
              <tr>
                <th onClick={() => toggleSort('department')}>
                  สาขา
                </th>
                <th onClick={() => toggleSort('intake_plan')}>แผน</th>
                <th onClick={() => toggleSort('new_intake')}>แรกเข้า</th>
                <th onClick={() => toggleSort('retained')}>คงอยู่</th>
                <th onClick={() => toggleSort('not_open')}>
                  ยังไม่เปิด
                </th>
                <th onClick={() => toggleSort('total')}>รวม</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.department}>
                  <td>{r.department}</td>
                  <td>{formatNumber(r.intake_plan)}</td>
                  <td className="highlight">
                    {formatNumber(r.new_intake)}
                  </td>
                  <td>{formatNumber(r.retained)}</td>
                  <td>{formatNumber(r.not_open)}</td>
                  <td className="bold">
                    {formatNumber(r.total)}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td>รวม</td>
                <td>{formatNumber(sum.intake_plan)}</td>
                <td>{formatNumber(sum.new_intake)}</td>
                <td>{formatNumber(sum.retained)}</td>
                <td>{formatNumber(sum.not_open)}</td>
                <td>{formatNumber(sum.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ================= CHART ================= */}
      <div className="panel softPanel">
        <div className="panelHeader">
          <div>
            <div className="panelTitle">
              กราฟแท่งรายสาขา (ปี {props.record.year})
            </div>
            <div className="panelSubtitle">
              โทนสีเลือดหมู • อ่านง่าย • ไม่ดำ
            </div>
          </div>
        </div>

        <div className="chartBox">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 90 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

              <XAxis
                dataKey="department"
                interval={0}
                angle={-35}
                textAnchor="end"
                height={90}
              />

              <YAxis />

              <Tooltip
                formatter={(v: any) =>
                  formatNumber(Number(v))
                }
              />

              <Legend />

              <Bar
                dataKey="new"
                name="นศ.แรกเข้า"
                fill={COLORS.new}
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="retained"
                name="คงอยู่"
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

        <div className="note">
          💡 ข้อมูลมาจาก <code>by_department</code> ในไฟล์ JSON
        </div>
      </div>
    </div>
  )
}