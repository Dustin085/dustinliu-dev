// lib/cornerstoneSetup.ts
import {
    init as cs3DInit,
} from '@cornerstonejs/core'
import {
    PanTool,
    ZoomTool,
    WindowLevelTool,
    ToolGroupManager,
    init as toolsInit,
} from '@cornerstonejs/tools'
import dicomImageLoader from '@cornerstonejs/dicom-image-loader'

// null => 還沒跑過 setup, 
// Promise pending => 正在 setup, 
// Promise resolve => setup 完成, 
// Promise reject => setup error,
let initPromise: Promise<void> | null = null

export function setupCornerstone() {
    // 使用 promise 來防止 race condition，promise 可以讓每個使用 setup 的組件都會等到 setup 完成才繼續執行
    if (!initPromise) {
        initPromise = (async () => {
            await cs3DInit()
            await toolsInit()
            dicomImageLoader.init({ maxWebWorkers: 1 })
            // imageLoadPoolManager.maxNumRequests = {
            //     interaction: 40,
            //     thumbnail: 2,
            //     prefetch: 5, // 500張圖時，這個數字不要太大
            //     compute: 1,    // <--- 這是保護 WebGL 不掛掉最重要的設定
            // }

            console.log('Cornerstone 已初始化')
        })()
    }

    return initPromise
}

// 建立 ToolGroup 的 helper
export function createViewerToolGroup(toolGroupId: string) {
    let tg = ToolGroupManager.getToolGroup(toolGroupId)
    if (!tg) {
        tg = ToolGroupManager.createToolGroup(toolGroupId)
        if (tg === undefined) {
            throw Error('Both getToolGroup, createToolGroup return undefined.')
        }
        tg.addTool(PanTool.toolName)
        tg.addTool(ZoomTool.toolName)
        tg.addTool(WindowLevelTool.toolName)
    }
    return tg
}