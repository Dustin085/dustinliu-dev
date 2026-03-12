import * as cornerstone from '@cornerstonejs/core';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';

/**
 * 專門處理本地 File 物件的 Helper
 * 1. 將 File 物件轉換為 wadouri imageId
 * 2. 預解析 Metadata 並存入 cornerstone.metaData provider
 */
export async function createImageIdsAndCacheMetaData(files: File[]) {
    // 1. 產生 ImageIds
    const imageIds = files.map((file) => {
        return dicomImageLoader.wadouri.fileManager.add(file);
    });

    // 2. 遍歷並確保 Metadata 被解析
    // 對於 Volume 渲染，我們需要預先拿到所有切片的空間資訊
    const promises = imageIds.map(async (imageId) => {
        // 這裡我們不使用 loadImage (避免佔用像素記憶體)
        // 我們直接呼叫 imageLoader 的解析方法或簡單地加載一張圖來填充 provider
        // 在 v4 中，最好的做法是透過 metadata provider 預存
        const image = await cornerstone.imageLoader.loadAndCacheImage(imageId);
        return image;
    });

    // 等待所有 Metadata 載入
    await Promise.all(promises);

    return imageIds;
}