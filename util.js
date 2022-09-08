import NodeTypes from "./nodes/index.js"


function getNode(nodeId, nodes) {
    return nodes.find(node => node.id == nodeId)
}

function getConnectedHandles(nodeId, handleName, nodes, edges) {

    return edges
        .filter(edge =>
            (edge.target == nodeId && edge.targetHandle == handleName) ||
            (edge.source == nodeId && edge.sourceHandle == handleName)
        )
        .map(edge =>
            edge.target == nodeId ? {
                node: getNode(edge.source, nodes),
                handle: edge.sourceHandle
            } : {
                node: getNode(edge.target, nodes),
                handle: edge.targetHandle
            }
        )
}

export function setupNode(node, setupObservable) {
    const nodeType = NodeTypes[node.type]
    nodeType.setup?.bind(node)(setupObservable)
}

export function prepNode(node, nodes, edges) {
    prepValueSources(node, nodes, edges)
    prepValueTargets(node, nodes, edges)
    prepSignalTargets(node, nodes, edges)
    prepSignalSources(node, nodes, edges)
}

export function prepValueSources(node, nodes, edges) {
    const nodeType = NodeTypes[node.type]

    // create getters for value sources
    nodeType?.sources?.values &&
        Object.entries(nodeType.sources.values).forEach(([handleName, valueSourceData]) => {
            Object.defineProperty(node, handleName, {
                get() {
                    return valueSourceData?.get.bind(node)()
                }
            })
        })
}

export function prepValueTargets(node, nodes, edges) {
    const nodeType = NodeTypes[node.type]

    // create getters for value targets
    nodeType?.targets?.values &&
        Object.entries(nodeType.targets.values).forEach(([handleName, valueTargetData]) => {

            const connectedHandles = getConnectedHandles(node.id, handleName, nodes, edges)

            Object.defineProperty(node, handleName, {
                get() {
                    return connectedHandles.map(
                        connected => connected.node[connected.handle]
                    )
                }
            })
        })
}

export function prepSignalTargets(node, nodes, edges) {
    const nodeType = NodeTypes[node.type]

    // create actions for signal targets
    nodeType?.targets?.signals &&
        Object.entries(nodeType.targets.signals).forEach(([handleName, signalTargetData]) => {
            node[handleName] = signalTargetData.action.bind(node)
        })
}

export function prepSignalSources(node, nodes, edges) {
    const nodeType = NodeTypes[node.type]

    // create actions for signal sources
    nodeType?.sources?.signals &&
        Object.entries(nodeType.sources.signals).forEach(([handleName, signalSourceData]) => {

            const connectedHandles = getConnectedHandles(node.id, handleName, nodes, edges)

            node[handleName] = signal => {
                connectedHandles.forEach(
                    connected => connected.node[connected.handle](signal)
                )
            }
        })
}

export class Observable {
    constructor() {
        this.subscribers = []
    }

    subscribe(func) {
        this.subscribers.push(func)
    }

    fire(...args) {
        this.subscribers.forEach(subscriber => subscriber(...args))
    }
}