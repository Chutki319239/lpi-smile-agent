const { spawn } = require("child_process");

const server = spawn("node", ["../lpi-developer-kit-chutki3477/dist/src/index.js"]);

const question = process.argv[2];

let responses = [];

function send(message) {
    server.stdin.write(JSON.stringify(message) + "\n");
}

// Initialize
send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
            name: "lpi-smile-agent",
            version: "1.0.0"
        }
    }
});

// Query Knowledge
send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
        name: "query_knowledge",
        arguments: { query: question }
    }
});

// Case Studies
send({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
        name: "get_case_studies",
        arguments: { industry: "healthcare" }
    }
});

server.stdout.on("data", (data) => {
    const lines = data.toString().split("\n").filter(Boolean);

    for (let line of lines) {
        try {
            const json = JSON.parse(line);

            if (json.id === 2 || json.id === 3) {
                responses.push(json);
            }

            // Once both responses received → print & exit
            if (responses.length === 2) {
                console.log(JSON.stringify({
                    knowledge: responses.find(r => r.id === 2),
                    cases: responses.find(r => r.id === 3)
                }));

                server.kill();
                process.exit(0);
            }

        } catch (e) {}
    }
});