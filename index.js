import { prepNode, setupNode, Observable } from "./util.js"

export function runFlow({
    nodes,
    edges,
    setupPayload = {},
}) {

    // prep the graph for execution
    prepGraph(nodes, edges)

    // create observable to track when setup is done
    const setupObservable = new Observable()

    // setup nodes
    nodes.forEach(node => setupNode(node, setupObservable))

    // fire setup observable
    setupObservable.fire(setupPayload)
}


function prepGraph(nodes, edges) {
    nodes.forEach(node => prepNode(node, nodes, edges))
}

