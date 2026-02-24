import React, { useEffect, useMemo, useState } from 'react'
import type { StudentsDataset, YearRecord } from './types'
import { YearSelector } from './components/YearSelector'
import { SummaryCards } from './components/SummaryCards'
import { BarChartPanel } from './components/BarChartPanel'
import { PieChartPanel } from './components/PieChartPanel'
import { DepartmentDashboard } from './components/DepartmentDashboard'
import { Tabs, type TabKey } from './components/Tabs'

const DEFAULT_DATA_URL = '/data/students_65_67.json'

async function loadDataset(url: string): Promise<StudentsDataset> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ: ${res.status} ${res.statusText}`)
  return (await res.json()) as StudentsDataset
}

export default function App() {
  const dataUrl = import.meta.env.VITE_DATA_URL || DEFAULT_DATA_URL
  const [dataset, setDataset] = useState<StudentsDataset | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [year, setYear] = useState<number>(67)
  const [tab, setTab] = useState<TabKey>('overview')

  useEffect(() => {
    let isMounted = true
    loadDataset(dataUrl)
      .then((ds) => {
        if (!isMounted) return
        setDataset(ds)
        const years = ds.meta.academic_years
        setYear(years.includes(67) ? 67 : years[years.length - 1])
      })
      .catch((e: any) => {
        if (!isMounted) return
        setError(e?.message ?? String(e))
      })
    return () => {
      isMounted = false
    }
  }, [dataUrl])

  const records: YearRecord[] = useMemo(() => dataset?.records ?? [], [dataset])
  const years = useMemo(
    () => dataset?.meta.academic_years ?? records.map((r) => r.year).sort(),
    [dataset, records],
  )
  const selected = useMemo(() => records.find((r) => r.year === year) ?? records[0], [records, year])

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brandTitle">แดชบอร์ดจำนวนนักศึกษา</div>
          <div className="brandSubtitle">
            {dataset?.meta?.faculty ?? 'คณะวิศวกรรมศาสตร์'}
            {dataset?.meta?.university ? ` • ${dataset.meta.university}` : ''}
            {dataset?.meta?.generated_at ? ` • อัปเดต: ${new Date(dataset.meta.generated_at).toLocaleString('th-TH')}` : ''}
          </div>
        </div>
        <div className="topbarRight">{years.length > 0 ? <YearSelector years={years} value={year} onChange={setYear} /> : null}</div>
      </header>

      <main className="content">
        {error ? (
          <div className="error">
            <div className="errorTitle">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
            <div className="errorMsg">{error}</div>
            <div className="errorHint">
              ตรวจสอบว่าไฟล์ JSON อยู่ที่ <code>public/data/students_65_67.json</code> หรือกำหนด <code>VITE_DATA_URL</code> ถูกต้อง
            </div>
          </div>
        ) : null}

        {!dataset ? (
          <div className="loading">กำลังโหลดข้อมูล…</div>
        ) : selected ? (
          <>
            <Tabs value={tab} onChange={setTab} />
            <SummaryCards record={selected} />

            {tab === 'overview' ? (
              <div className="grid2">
                <PieChartPanel record={selected} />
                <BarChartPanel records={records} />
              </div>
            ) : (
              <DepartmentDashboard record={selected} />
            )}
          </>
        ) : (
          <div className="loading">ไม่พบข้อมูล</div>
        )}
      </main>

      <footer className="footer">
        <span>ข้อมูล: ปีการศึกษา 65–67 • รายสาขา: by_department</span>
      </footer>
    </div>
  )
}
