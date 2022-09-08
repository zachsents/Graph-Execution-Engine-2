import { BasicValueSource } from "./commonHandles.js"

export default {
    Bind: {
        id: "Bind",
        name: "Bind",
        description: "Binds a value to a signal.",
        categories: ["Utility"],
        targets: {
            values: {
                value: {}
            },
            signals: {
                signal: {
                    action() {
                        this.out(this.value)
                    }
                }
            }
        },
        sources: {
            signals: {
                out: {}
            }
        },
    },
    Unbind: {
        id: "Unbind",
        name: "Unbind",
        description: "Separates a signal and the values it contains.",
        categories: ["Utility"],
        targets: {
            signals: {
                signal: {
                    action(x) {
                        this.state.$ = x
                        this.out()
                    }
                }
            },
        },
        sources: {
            values: {
                value: BasicValueSource()
            },
            signals: {
                out: {}
            }
        },
    }
}