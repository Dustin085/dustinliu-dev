'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as cornerstone from '@cornerstonejs/core'
import * as cornerstoneTools from '@cornerstonejs/tools'
import * as dicomImageLoader from '@cornerstonejs/dicom-image-loader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Upload,
    Ruler,
    SunMedium,
    Hand,
    ZoomIn,
    Layers,
    RotateCcw,
    Activity,
    Locate,
} from 'lucide-react'
import { setupCornerstone } from '@/lib/cornerstoneSetup'
import { ViewportPanel } from '@/app/features/dcm-viewer/components/ViewportPanel'
import { ToolButton } from '@/app/features/dcm-viewer/components/ToolButton'
import { createVOISynchronizer } from '@cornerstonejs/tools/synchronizers'
import { SynchronizerManager } from '@cornerstonejs/tools'
import { getValidatedMetadata } from '@/app/features/dcm-viewer/hooks/getValidatedMetadata'

const { RenderingEngine, volumeLoader, Enums, cache } = cornerstone
const { ViewportType, OrientationAxis } = Enums
const {
    StackScrollTool,
    WindowLevelTool,
    LengthTool,
    PanTool,
    ZoomTool,
    CrosshairsTool,
    ToolGroupManager,
    Enums: ToolEnums,
} = cornerstoneTools

// ID 命名
const RENDERING_ENGINE_ID = 'volumeEngine'
const TOOL_GROUP_ID = 'volumeToolGroup'
const VOLUME_ID = 'cornerstoneStreamingImageVolume:localVolume'

const VIEWPORT_IDS = {
    AXIAL: 'AXIAL',
    SAGITTAL: 'SAGITTAL',
    CORONAL: 'CORONAL',
}

const SYNC_IDS = {
    VOISYNC: 'voiSync'
}

// 啟用工具
type ActiveTool = 'windowLevel' | 'length' | 'pan' | 'zoom' | 'crosshairs'

// 將工具名轉換成 cornerstone 使用的 toolName
const TOOL_NAME_MAP: Record<ActiveTool, string> = {
    windowLevel: WindowLevelTool.toolName,
    length: LengthTool.toolName,
    pan: PanTool.toolName,
    zoom: ZoomTool.toolName,
    crosshairs: CrosshairsTool.toolName
}

// async function prefetchMetadata(imageId: string) {
//     await dicomImageLoader.wadouri.loadImage(imageId).promise
// }


// 主元件
export function CornerstoneVolume() {
    const axialRef = useRef<HTMLDivElement>(null)
    const sagittalRef = useRef<HTMLDivElement>(null)
    const coronalRef = useRef<HTMLDivElement>(null)
    const engineRef = useRef<cornerstone.RenderingEngine | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
    const [progress, setProgress] = useState({ current: 0, total: 0 })
    const [activeTool, setActiveTool] = useState<ActiveTool>('windowLevel')
    const [fileCount, setFileCount] = useState(0)
    const [dicomMetadata, setDicomMetadata] = useState<{
        patientName: string
        patientId: string
        studyDate: string
        modality: string
        seriesDescription: string
        sliceThickness: string
    } | null>(null)

    // Cornerstone 初始化
    useEffect(() => {
        const run = async () => {
            // cornerstone init
            await setupCornerstone()

            // 確認所有 ref 都已掛載
            if (!axialRef.current || !sagittalRef.current || !coronalRef.current) {
                console.error('Viewport elements not ready')
                return
            }

            // 定義 render engine 與 viewports
            const engine = new RenderingEngine(RENDERING_ENGINE_ID)
            engineRef.current = engine

            engine.setViewports([
                {
                    viewportId: VIEWPORT_IDS.AXIAL,
                    type: ViewportType.ORTHOGRAPHIC,
                    element: axialRef.current!,
                    defaultOptions: {
                        orientation: OrientationAxis.AXIAL,
                        background: [0, 0, 0] as cornerstone.Types.Point3,
                    },
                },
                {
                    viewportId: VIEWPORT_IDS.SAGITTAL,
                    type: ViewportType.ORTHOGRAPHIC,
                    element: sagittalRef.current!,
                    defaultOptions: {
                        orientation: OrientationAxis.SAGITTAL,
                        background: [0, 0, 0] as cornerstone.Types.Point3,
                    },
                },
                {
                    viewportId: VIEWPORT_IDS.CORONAL,
                    type: ViewportType.ORTHOGRAPHIC,
                    element: coronalRef.current!,
                    defaultOptions: {
                        orientation: OrientationAxis.CORONAL,
                        background: [0, 0, 0] as cornerstone.Types.Point3,
                    },
                },
            ])

            // VOI = Value of Interest，也就是 WW/WL
            // syncInvertState 代表要同步反色，syncColormap 代表同步套用 colorMap
            SynchronizerManager.destroySynchronizer(SYNC_IDS.VOISYNC)
            const voiSynchronizer = createVOISynchronizer(SYNC_IDS.VOISYNC,
                { syncInvertState: false, syncColormap: false })

            Object.values(VIEWPORT_IDS).forEach((id) => {
                voiSynchronizer.add({
                    renderingEngineId: RENDERING_ENGINE_ID,
                    viewportId: id,
                })
            })

            // 建立工具群組
            ToolGroupManager.destroyToolGroup(TOOL_GROUP_ID) // async run() 導致 cleanup 的 destroy 在 toolGroup 實際建立前就執行，Strict Mode 第二次 mount 時需手動 destroy 確保乾淨重建
            const toolGroup = ToolGroupManager.createToolGroup(TOOL_GROUP_ID)
            if (!toolGroup) throw Error('Tool group create failed.')

                // 全域註冊工具
                ;[WindowLevelTool, StackScrollTool, LengthTool, PanTool, ZoomTool, CrosshairsTool].forEach(
                    (tool) => cornerstoneTools.addTool(tool)
                )
                // 將工具加進 tool group
                ;[
                    WindowLevelTool.toolName,
                    StackScrollTool.toolName,
                    LengthTool.toolName,
                    PanTool.toolName,
                    ZoomTool.toolName,
                    CrosshairsTool.toolName,
                ].forEach((name) => toolGroup.addTool(name))

            // Tool 的狀態有以下：
            // Active   → 有綁定滑鼠/鍵盤，會回應互動並渲染標註
            // Passive  → 沒有綁定輸入，但標註仍然可見，且可以被選取/移動
            // Enabled  → 標註可見，但不能被選取或移動
            // Disabled → 完全不作用，標註也不顯示
            toolGroup.setToolActive(WindowLevelTool.toolName, {
                bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }],
            })
            toolGroup.setToolActive(PanTool.toolName, {
                bindings: [{ mouseButton: ToolEnums.MouseBindings.Auxiliary }],
            })
            toolGroup.setToolActive(ZoomTool.toolName, {
                bindings: [{ mouseButton: ToolEnums.MouseBindings.Secondary }],
            })
            toolGroup.setToolActive(StackScrollTool.toolName, {
                bindings: [{ mouseButton: ToolEnums.MouseBindings.Wheel }],
            })
            toolGroup.setToolPassive(LengthTool.toolName)
            // 設定 CrosshairsTool passive 時會嘗試讀取 viewports，此時若 viewports 還沒有 volume，就會炸
            // toolGroup.setToolPassive(CrosshairsTool.toolName)

            // 將工具加入到 viewport
            Object.values(VIEWPORT_IDS).forEach((id) =>
                toolGroup.addViewport(id, RENDERING_ENGINE_ID)
            )
        }

        run()

        // cleanup
        return () => {
            SynchronizerManager.destroySynchronizer(SYNC_IDS.VOISYNC)
            ToolGroupManager.destroyToolGroup(TOOL_GROUP_ID)
            engineRef.current?.destroy()
        }
    }, [])

    // 工具切換
    const switchTool = useCallback((tool: ActiveTool) => {
        setActiveTool(tool)
        const toolGroup = ToolGroupManager.getToolGroup(TOOL_GROUP_ID)
        if (!toolGroup) return

        const primary = ToolEnums.MouseBindings.Primary

            // 全部先設為 Passive，setToolPassive 只清除左鍵
            // setToolPassive(PanTool.toolName, { removeAllBindings: true }) 才會清除所有 bindings
            // https://www.cornerstonejs.org/docs/api/tools/namespaces/types/classes/itoolgroup/#settoolpassive
            ;[WindowLevelTool, LengthTool, PanTool, ZoomTool, CrosshairsTool].forEach((t) =>
                toolGroup.setToolPassive(t.toolName)
            )

        const toolName = TOOL_NAME_MAP[tool]

        toolGroup.setToolActive(toolName, { bindings: [{ mouseButton: primary }] })
    }, [])

    // 重設視角
    const resetViewports = useCallback(() => {
        const engine = engineRef.current
        if (!engine) return
        Object.values(VIEWPORT_IDS).forEach((id) => {
            const vp = engine.getViewport(id) as cornerstone.Types.IVolumeViewport
            vp?.resetCamera()
        })
        // 觸發渲染
        engine.renderViewports(Object.values(VIEWPORT_IDS))
    }, [])

    // 檔案上傳
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        setStatus('loading')
        setProgress({ current: 0, total: files.length })
        setFileCount(files.length)

        try {
            // 清除舊快取
            cache.purgeCache()

            const imageIds: string[] = []
            for (let i = 0; i < files.length; i++) {
                const imageId = dicomImageLoader.wadouri.fileManager.add(files[i])
                await dicomImageLoader.wadouri.loadImage(imageId).promise
                imageIds.push(imageId)

                // 只從第一張讀 metadata（整個 series 的病人資訊都一樣）
                if (i === 0) {
                    // 使用 safeParse
                    const result = getValidatedMetadata(imageId)

                    if (!result.success) {
                        console.warn('Invalid DICOM metadata', result.error)
                    } else {
                        const dicom = result.data
                        console.log('Validated metadata', dicom)
                    }

                    setDicomMetadata({
                        patientName: result.data?.PatientName ?? 'N/A',
                        patientId: result.data?.PatientID ?? 'N/A',
                        studyDate: result.data?.StudyDate?.toLocaleDateString() ?? 'N/A',
                        modality: result.data?.Modality ?? 'N/A',
                        seriesDescription: result.data?.SeriesDescription ?? 'N/A',
                        sliceThickness: String(result.data?.SliceThickness) ?? 'N/A',
                    })
                }

                setProgress({ current: i + 1, total: files.length })
            }

            const volume = await volumeLoader.createAndCacheVolume(VOLUME_ID, { imageIds })
            volume.load()

            const engine = engineRef.current!
            await Promise.all(
                Object.values(VIEWPORT_IDS).map((id) => {
                    const vp = engine.getViewport(id) as cornerstone.Types.IVolumeViewport
                    return vp.setVolumes([{ volumeId: VOLUME_ID }])
                })
            )

            // volume 載入完成後才設 CrosshairsTool 初始狀態
            const toolGroup = ToolGroupManager.getToolGroup(TOOL_GROUP_ID)
            toolGroup?.setToolPassive(CrosshairsTool.toolName)

            // volume 載入完成後，拿到 tool instance 再設顏色
            const crosshairsTool = toolGroup?.getToolInstance(CrosshairsTool.toolName) as cornerstoneTools.CrosshairsTool

            crosshairsTool._getReferenceLineColor = (viewportId: string) => {
                const colorMap: Record<string, string> = {
                    [VIEWPORT_IDS.AXIAL]: 'rgb(255, 100, 100)',
                    [VIEWPORT_IDS.SAGITTAL]: 'rgb(100, 255, 100)',
                    [VIEWPORT_IDS.CORONAL]: 'rgb(100, 100, 255)',
                }
                return colorMap[viewportId] ?? 'white'
            }

            engine.renderViewports(Object.values(VIEWPORT_IDS))
            setStatus('ready')
        } catch (err) {
            console.error(err)
            setStatus('error')
        }
    }

    // derived state 衍生狀態
    const isLoaded = status === 'ready'

    return (
        <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-mono">

            {/* ── Topbar ── */}
            <header className="flex items-center gap-3 px-4 h-12 border-b border-zinc-800 shrink-0">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span className="text-sm tracking-widest text-zinc-300 uppercase">
                    DICOM Volume Viewer
                </span>

                <Separator orientation="vertical" className="h-5 bg-zinc-700 mx-1" />

                {/* 狀態 badge */}
                {status === 'idle' && (
                    <Badge variant="outline" className="border-zinc-700 text-zinc-500 font-mono text-xs">
                        NO STUDY
                    </Badge>
                )}
                {status === 'loading' && (
                    <Badge variant="outline" className="border-yellow-700 text-yellow-400 font-mono text-xs animate-pulse">
                        LOADING {progress.current}/{progress.total}
                    </Badge>
                )}
                {status === 'ready' && (
                    <Badge variant="outline" className="border-emerald-700 text-emerald-400 font-mono text-xs">
                        {fileCount} SLICES LOADED
                    </Badge>
                )}
                {status === 'error' && (
                    <Badge variant="outline" className="border-red-700 text-red-400 font-mono text-xs">
                        ERROR
                    </Badge>
                )}

                {/* 上傳按鈕 */}
                <div className="ml-auto">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".dcm"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={status === 'loading'}
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 rounded-none border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 font-mono text-xs tracking-wider"
                    >
                        <Upload className="h-3.5 w-3.5 mr-2" />
                        OPEN FILES
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">

                {/* ── 左側工具列 ── */}
                <aside className="flex flex-col items-center gap-1 px-1 py-3 border-r border-zinc-800 bg-zinc-950 w-12 shrink-0">
                    <ToolButton
                        icon={<SunMedium className="h-4 w-4" />}
                        label="Window / Level  [左鍵]"
                        active={activeTool === 'windowLevel'}
                        onClick={() => switchTool('windowLevel')}
                        disabled={!isLoaded}
                    />
                    <ToolButton
                        icon={<Locate className="h-4 w-4" />}
                        label="Crosshairs  [左鍵]"
                        active={activeTool === 'crosshairs'}
                        onClick={() => switchTool('crosshairs')}
                        disabled={!isLoaded}
                    />
                    <ToolButton
                        icon={<Ruler className="h-4 w-4" />}
                        label="Length Tool  [左鍵]"
                        active={activeTool === 'length'}
                        onClick={() => switchTool('length')}
                        disabled={!isLoaded}
                    />
                    <ToolButton
                        icon={<Hand className="h-4 w-4" />}
                        label="Pan  [左鍵]"
                        active={activeTool === 'pan'}
                        onClick={() => switchTool('pan')}
                        disabled={!isLoaded}
                    />
                    <ToolButton
                        icon={<ZoomIn className="h-4 w-4" />}
                        label="Zoom  [左鍵]"
                        active={activeTool === 'zoom'}
                        onClick={() => switchTool('zoom')}
                        disabled={!isLoaded}
                    />

                    <Separator className="bg-zinc-800 my-1" />

                    <ToolButton
                        icon={<Layers className="h-4 w-4" />}
                        label="Scroll Slices  [滾輪]"
                        onClick={() => { }}
                        disabled
                    />
                    <ToolButton
                        icon={<RotateCcw className="h-4 w-4" />}
                        label="Reset Viewports"
                        onClick={resetViewports}
                        disabled={!isLoaded}
                    />
                </aside>

                {/* ── Viewport 區 ── */}
                <main className="flex flex-col flex-1 min-w-0 min-h-0 gap-px bg-zinc-800">

                    {/* 上排：Axial + Sagittal */}
                    <div className="flex flex-1 min-h-0 gap-px">
                        <ViewportPanel label="AXIAL" divRef={axialRef} className="flex-1" />
                        <ViewportPanel label="SAGITTAL" divRef={sagittalRef} className="flex-1" />
                    </div>

                    {/* 下排：Coronal + 空白資訊區 */}
                    <div className="flex flex-1 min-h-0 gap-px">
                        <ViewportPanel label="CORONAL" divRef={coronalRef} className="flex-1" />

                        {/* 右下：操作說明 / 空狀態 */}
                        <div className="flex-1 border border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center gap-3">
                            {status === 'idle' && (
                                <>
                                    <Upload className="h-8 w-8 text-zinc-700" />
                                    <p className="text-zinc-600 text-xs tracking-widest text-center">
                                        OPEN A DICOM SERIES<br />TO BEGIN
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-2 rounded-none border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800 font-mono text-xs"
                                    >
                                        SELECT FILES
                                    </Button>
                                </>
                            )}
                            {status === 'loading' && (
                                <>
                                    <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-200"
                                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-emerald-500 text-xs tracking-widest animate-pulse">
                                        PREFETCHING METADATA...
                                    </p>
                                </>
                            )}
                            {status === 'ready' && dicomMetadata && (
                                <div className="text-xs font-mono w-full h-full p-4 space-y-1">
                                    <p className="text-zinc-400 tracking-widest mb-3">PATIENT INFO</p>
                                    <p><span className="text-zinc-600">NAME</span> <span className="text-zinc-300">{dicomMetadata.patientName}</span></p>
                                    <p><span className="text-zinc-600">ID</span> <span className="text-zinc-300">{dicomMetadata.patientId}</span></p>
                                    <p><span className="text-zinc-600">DATE</span> <span className="text-zinc-300">{dicomMetadata.studyDate}</span></p>
                                    <p><span className="text-zinc-600">MODALITY</span> <span className="text-zinc-300">{dicomMetadata.modality}</span></p>
                                    <p><span className="text-zinc-600">SERIES</span> <span className="text-zinc-300">{dicomMetadata.seriesDescription}</span></p>
                                    <p><span className="text-zinc-600">THICKNESS</span> <span className="text-zinc-300">{dicomMetadata.sliceThickness} mm</span></p>
                                    <Separator className="bg-zinc-800 my-3" />
                                    <p className="text-zinc-400 tracking-widest mb-3">MOUSE BINDINGS</p>
                                    <p className="text-zinc-600">LEFT — Active Tool</p>
                                    <p className="text-zinc-600">MIDDLE — Pan</p>
                                    <p className="text-zinc-600">RIGHT — Zoom</p>
                                    <p className="text-zinc-600">SCROLL — Slice</p>
                                </div>
                            )}
                            {status === 'error' && (
                                <p className="text-red-500 text-xs tracking-widest text-center">
                                    LOAD FAILED<br />CHECK CONSOLE
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}