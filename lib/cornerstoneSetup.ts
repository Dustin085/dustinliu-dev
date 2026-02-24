// lib/cornerstoneSetup.ts
import {
    init as cs3DInit,
} from '@cornerstonejs/core'
import {
    addTool,
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

            addTool(PanTool)
            addTool(ZoomTool)
            addTool(WindowLevelTool)

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