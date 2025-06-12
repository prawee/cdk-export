import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import * as ExcelJS from 'exceljs'

const app = new Hono()

app.get('/', (c) => c.text('Hello World'))
app.get('/excel', async (c) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Demo')
    worksheet.addRow(['Date', 'Data'])
    worksheet.addRow([new Date(), 'Data 1'])
    worksheet.addRow([new Date(), 'Data 2'])
    worksheet.addRow([new Date(), 'Data 3'])

    const buffer = await workbook.xlsx.writeBuffer()
    // const base64 = Buffer.from(buffer).toString('base64')

    // c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    // c.header('Content-Disposition', 'attachment; filename="demo.xlsx"')
    // return c.body(csv)
    // return new Response(buffer, {
    //     status: 200,
    //     headers: {
    //         'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //         'Content-Disposition': 'attachment; filename="cdk-export-excel-demo.xlsx"',
    //     },
    // })
    // return c.json({
    //     isBase64Encoded: true,
    //     statusCode: 200,
    //     headers: {
    //         'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //         'Content-Disposition': 'attachment; filename="cdk-export-excel-demo.xlsx"',
    //     },
    //     body: base64,
    // }, 200)
    // return new Response(base64, {
    //     status: 200,
    //     headers: {
    //         'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //         'Content-Disposition': 'attachment; filename="cdk-export-excel-demo.xlsx"',
    //     },
    // })
    c.status(200)
    c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    c.header('Content-Disposition', 'attachment; filename="cdk-export-excel-demo.xlsx"')
    return c.body(buffer)
})

export const handler = handle(app)