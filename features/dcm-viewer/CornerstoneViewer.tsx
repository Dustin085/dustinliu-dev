'use client'

import { useEffect, useRef, useState } from 'react'

import {
    RenderingEngine,
    Enums as csCoreEnums,
    StackViewport,
    metaData,
} from '@cornerstonejs/core'

import {
    PanTool,
    ZoomTool,
    WindowLevelTool,
    ToolGroupManager,
    Enums as csToolsEnums,
    addTool,
} from '@cornerstonejs/tools'

import { IToolGroup } from '@cornerstonejs/tools/types'
import { createViewerToolGroup, setupCornerstone } from '@/lib/cornerstoneSetup'
import { DEFAULT_WINDOW_PRESETS, WindowPreset } from '@/features/dcm-viewer/constants'
import { normalizeToArray } from '@/lib/utils'

addTool(PanTool)
addTool(ZoomTool)
addTool(WindowLevelTool)

export function CornerstoneViewer() {
    const [error, setError] = useState<Error | null>(null);
    const elementRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<StackViewport | null>(null)
    const [windowPresets, setWindowPresets] = useState<WindowPreset[]>([])
    const [selectedWindowPresetIndex, setSelectedWindowPresetIndex] = useState<number>(0)

    /**
     * 將 window level 跟 window width 應用到 viewport
     * @param preset wl => window level (或window center), ww => window width
     * @param viewport 要被應用的 viewport
     */
    function applyWindowPreset(
        preset: { wl: number; ww: number },
        viewport: StackViewport
    ) {
        const lower = preset.wl - preset.ww / 2
        const upper = preset.wl + preset.ww / 2

        viewport.setProperties({
            voiRange: { lower, upper },
        })
    }

    useEffect(() => {
        let renderingEngine: RenderingEngine
        let toolGroup: IToolGroup | undefined

        const toolGroupId = 'toolGroup'

        const run = async () => {
            try {
                await setupCornerstone()
            } catch (e) {
                const normalizedError =
                    e instanceof Error
                        ? e
                        : new Error(`Unknown error: ${JSON.stringify(e)}`)

                setError(normalizedError)
            }

            const renderingEngineId = 'myRenderingEngine'
            const viewportId = 'CT_STACK'

            renderingEngine = new RenderingEngine(renderingEngineId)

            const element = elementRef.current!

            renderingEngine.enableElement({
                viewportId,
                type: csCoreEnums.ViewportType.STACK,
                element,
            })

            const viewport = renderingEngine.getViewport(viewportId)
            if (!(viewport instanceof StackViewport)) {
                throw new Error('Viewport is not a StackViewport')
            }
            viewportRef.current = viewport

            // 👉 官方 sample 單張 DICOM
            const imageId =
                'wadouri:https://raw.githubusercontent.com/cornerstonejs/cornerstone3D/main/packages/dicomImageLoader/testImages/CTImage.dcm'


            await viewport.setStack([imageId])
            // 重置攝影機，讓影像佔滿 viewport
            viewport.resetCamera()

            // 取得 DICOM 內附的 window presets (windowCenter / windowWidth)
            const imageId0 = viewport.getCurrentImageId()

            const voiLutModule = metaData.get('voiLutModule', imageId0)

            const wc = voiLutModule.windowCenter || []
            const ww = voiLutModule.windowWidth || []

            const wcArr = normalizeToArray(wc) as number[]
            const wwArr = normalizeToArray(ww) as number[]

            let finalPresets = DEFAULT_WINDOW_PRESETS

            if (wcArr.length && wwArr.length) {
                finalPresets = wcArr
                    // 轉換成我們使用的格式
                    .map((center, i) => ({
                        label: `DICOM ${i + 1} (${center}/${wwArr[i]})`,
                        wl: center,
                        ww: wwArr[i],
                    }))
                    // 接上預設的 presets
                    .concat(DEFAULT_WINDOW_PRESETS)
            }

            setWindowPresets(finalPresets)

            // 套用第一個 preset
            applyWindowPreset(finalPresets[0], viewport)

            viewport.render()

            // 工具設定

            toolGroup = createViewerToolGroup(toolGroupId)

            if (!toolGroup) return

            toolGroup.addViewport(viewportId, renderingEngineId)

            toolGroup.setToolActive(PanTool.toolName, {
                bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
            })

            toolGroup.setToolActive(ZoomTool.toolName, {
                bindings: [{ mouseButton: csToolsEnums.MouseBindings.Secondary }],
            })

            toolGroup.setToolActive(WindowLevelTool.toolName, {
                bindings: [{ mouseButton: csToolsEnums.MouseBindings.Auxiliary }],
            })
        }

        run()

        return () => {
            if (toolGroup) {
                ToolGroupManager.destroyToolGroup(toolGroupId)
            }

            if (renderingEngine) {
                renderingEngine.destroy()
            }
        }
    }, [])

    // 切換 window preset 時 applyWindowPreset
    useEffect(() => {
        const viewport = viewportRef.current
        if (!viewport) return
        if (!windowPresets.length) return

        const preset = windowPresets[selectedWindowPresetIndex]
        if (!preset) return

        applyWindowPreset(preset, viewport)
        viewport.render()
    }, [selectedWindowPresetIndex, windowPresets])



    if (error) return <div>Viewer 初始化失敗，錯誤訊息：{error.message}</div>

    return (
        <>
            {windowPresets.length > 0 && (
                <select
                    id='window preset select'
                    name='window preset select'
                    className='text-foreground bg-background'
                    value={selectedWindowPresetIndex}
                    onChange={(e) => {
                        const index = Number(e.target.value)
                        setSelectedWindowPresetIndex(index)
                    }}
                >
                    {windowPresets.map((preset, index) => (
                        <option key={index} value={index}>
                            {preset.label}
                        </option>
                    ))}
                </select>
            )}
            <div
                ref={elementRef}
                style={{
                    width: '512px',
                    height: '512px',
                    backgroundColor: 'black'
                }}
                // prevent right click menu
                onContextMenu={(e) => e.preventDefault()}
            />
        </>
    )
}