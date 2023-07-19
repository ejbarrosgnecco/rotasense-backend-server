module.exports = {
    apps: [
        {
            name: "rotasense_server",
            script: "../node_modules/.bin/ts-node --transpiler sucrase/ts-node-plugin index.ts",
            watch: true
        }
    ]
}