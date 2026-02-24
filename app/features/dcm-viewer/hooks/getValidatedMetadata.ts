import { DicomMetadataSchema } from '@/app/features/dcm-viewer/schema'
import * as cornerstone from '@cornerstonejs/core'

export function getValidatedMetadata(imageId: string) {
    const normalized = cornerstone.metaData.getNormalized(
        imageId,
        ['patientModule', 'generalStudyModule', 'generalSeriesModule', 'imagePlaneModule']
    )
    return DicomMetadataSchema.safeParse(normalized)
}