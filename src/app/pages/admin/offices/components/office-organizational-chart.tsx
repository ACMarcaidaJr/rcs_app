"use client"

import * as React from "react"

import type {
    RelationGraphExpose,
    RGLine,
    RGLink,
    RGNode,
    RGNodeSlotProps,
    RGOptions,
    RGJsonData
} from "relation-graph-react"
import AddOfficeDialog from "./new-office-dialog"
import OfficeDetailsDialog from "./office-details-dialog"

type GraphData = RGJsonData & {
    rootId?: string | null
}
const NodeSlot: React.FC<RGNodeSlotProps> = ({ node }) => {
    return (
        <div className="bg-gray-100 relative flex flex-row items-center cursor-pointer max-w-[250px] min-w-[200px] h-fit">
            <OfficeDetailsDialog node={node} />
            <AddOfficeDialog node={node} />
        </div>

    )
}


const OfficeOrgChart: React.FC = () => {
    const [orgChartData, setOrgChartData] = React.useState<GraphData | null>(null)
    const [loadingOrgChart, setLoadingOrgChart] = React.useState<boolean>(false)

    const fetchOrgChart = async () => {
        try {
            setLoadingOrgChart(true)
            const res = await fetch(`/api/admin/office`)
            const data = await res.json()
            setOrgChartData(data?.data)
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoadingOrgChart(false)
        }
    }
    React.useEffect(() => {
        fetchOrgChart()
    }, [])

    const graphRef = React.useRef<RelationGraphExpose | null>(null)
    const [RelationGraph, setRelationGraph] = React.useState<any>(null)

    const options: RGOptions = {
        // backgroundImage: "/images/love_the_philippines.webp",
        backgroundImageNoRepeat: true,
        moveToCenterWhenRefresh: false,
        disableLineClickEffect: true,
        allowShowZoomMenu: false,
        allowAutoLayoutIfSupport: false,
        allowShowRefreshButton: false,
        allowShowDownloadButton: false,
        defaultExpandHolderPosition: "top",
        defaultNodeBorderWidth: 1,
        defaultNodeBorderColor: "#000000",
        defaultLineShape: 2,
        defaultJunctionPoint: "tb",
        graphOffset_x: 100,
        layouts: [
            {
                label: "RCS",
                layoutName: "tree",
                from: "top",
                layoutDirection: "v",
                distance_coefficient: 2,     // increase spacing multiplier
                min_per_width: 250,          // spacing between siblings
                max_per_width: 300,
                min_per_height: 150,
                max_per_height: 500
            }
        ]
    }

    React.useEffect(() => {
        import("relation-graph-react").then((mod) => {
            setRelationGraph(() => mod.default)
        })
    }, [])

    React.useEffect(() => {
        if (!RelationGraph || !graphRef.current) return
        showGraph()
    }, [RelationGraph, orgChartData])

    const showGraph = async () => {
        if (!graphRef.current || !orgChartData) return

        graphRef.current.setJsonData(orgChartData)

        const graph = graphRef.current.getInstance()
        graph.moveToCenter()
        graph.zoomToFit()
    }

    const onNodeClick = (node: RGNode) => {
        console.log("onNodeClick:", node.text)
        return true
    }

    // const onLineClick = (line: RGLine) => {
    //     console.log("onLineClick:", line.from, line.to)
    //     return true
    // }
    console.log("orgChartData", orgChartData)
    return (
        <div
            className="w-full h-[600px] border border-gray-200"
            style={{ touchAction: "none" }}
        >
            {RelationGraph && (
                <RelationGraph
                    ref={graphRef}
                    options={options}
                    nodeSlot={NodeSlot}
                    onNodeClick={onNodeClick}
                />
            )}
        </div>
    )
}

export default OfficeOrgChart