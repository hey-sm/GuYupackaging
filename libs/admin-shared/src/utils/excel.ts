import ExcelJS from 'exceljs'

interface ExcelData {
  header: Array<{ header: string; key: string }>
  data: Array<{ [key: string]: any }>
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'

export const excel = {
  /** 导出数据到excel */
  export(excelData: ExcelData, fileName?: string) {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('导出数据')
    sheet.columns = excelData.header
    sheet.addRows(excelData.data)
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: EXCEL_TYPE })
      this.downloadExcel(blob, fileName)
    })
  },

  downloadExcel(data: Blob, fileName?: string) {
    const file = [fileName, new Date().getTime()].filter((v) => !!v).join('_')
    const a = document.createElement('a')
    const url = URL.createObjectURL(data)
    a.href = url
    a.download = file + EXCEL_EXTENSION
    a.click()
    URL.revokeObjectURL(url)
  },
}


export default excel
