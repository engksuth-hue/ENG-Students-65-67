export type DepartmentRow = {
  department: string
  intake_plan: number
  new_intake: number
  retained: number
  not_open: number
  total: number
}

export type YearRecord = {
  year: number
  intake_plan: number
  new_intake: number
  retained: number
  not_open: number
  total: number
  by_department: DepartmentRow[]
}

export type StudentsDataset = {
  meta: {
    faculty: string
    university?: string
    academic_years: number[]
    generated_at?: string
  }
  records: YearRecord[]
}
