import { prepNode, setupNode, Observable } from "./util.js"

export function runFlow({
    nodes,
    edges,
    nodeTypes,
    setupPayload = {},
}) {

    // prep the graph for execution
    prepGraph(nodes, edges, nodeTypes)

    // create observable to track when setup is done
    const setupObservable = new Observable()

    // setup nodes
    nodes.forEach(node => setupNode(node, nodeTypes[node.type], setupObservable))

    // fire setup observable
    setupObservable.fire(setupPayload)
}


function prepGraph(nodes, edges, nodeTypes) {
    nodes.forEach(
        node => prepNode(node, nodeTypes[node.type], nodes, edges)
    )
}



export { default as NodeTypes } from "./nodes/index.js"