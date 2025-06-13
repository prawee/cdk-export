import { Hono } from 'hono'
import * as ExcelJS from 'exceljs'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import s3 from './config'

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
    // c.status(200)
    // c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    // c.header('Content-Disposition', 'attachment; filename="cdk-export-excel-demo.xlsx"')
    // return c.body(buffer)
    const s3Key = `excel/demo-${Date.now()}.xlsx`
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: Buffer.from(buffer),
        ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    await s3.send(command)

    const viewCommand = new GetObjectCommand({
        Key: s3Key,
        // ResponseContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Bucket: process.env.S3_BUCKET_NAME as string,
    })
    const signedUrl = await getSignedUrl(s3, viewCommand, {
        expiresIn: 60 * 60 * 24 * 7
    })
    // return c.json({ url: signedUrl })
    // return c.body(signedUrl)
    console.log('signedUrl', signedUrl)
    return c.redirect(signedUrl, 302)

    // const result = await fetch(signedUrl)
    // console.log('result', result)
    // return new Response(result.body, {
    //     status: 200,
    //     headers: {
    //         'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //         'Content-Disposition': 'attachment; filename="cdk-export-excel-demo.xlsx"',
    //     },
    // })
})

export default app