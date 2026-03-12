import { z } from 'zod'

// 日期結構
const DateSchema = z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
}).transform(d => {
    if (!d) return undefined
    return new Date(d.year, d.month - 1, d.day) // JS 月份 0-base
}).optional()

// 時間結構
const TimeSchema = z.object({
    hours: z.number(),
    minutes: z.number(),
    seconds: z.number(),
    fractionalSeconds: z.number().optional(),
}).optional()

// 驗證 cornerstone.metaData.getNormalized
// types => ['patientModule', 'generalStudyModule', 'generalSeriesModule', 'imagePlaneModule']
export const DicomMetadataSchema = z.object({
    PatientID: z.string(),
    PatientName: z.string(),
    StudyDescription: z.string().optional(),
    StudyDate: DateSchema, // 已轉成 JS date
    StudyTime: TimeSchema,
    SeriesDescription: z.string().optional(),
    SeriesDate: DateSchema.optional(),
    SeriesNumber: z.number().optional(),
    Modality: z.string(),
    SliceThickness: z.number().optional(),
    PixelSpacing: z.array(z.number()).optional(),
    ImageOrientationPatient: z.array(z.number()).length(6).optional(),
    ImagePositionPatient: z.array(z.number()).length(3).optional(),
})