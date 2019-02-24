import request from "request";

export class P2P {

    private nodes: Neighbour[] = [];

    constructor(public myAddr: string) {
        
    }

    addNode(addr: string, informOthers: boolean = true, exclude: string[] = []): any {
        this.nodes = this.nodes.filter(n => n.isDown == false);
        
        if (addr == this.myAddr) {
            return;
        }

        if (this.nodes.length > 25) {
            return;
        }
        
        if (this.nodes.find(n => n.address == addr)) {
            return;
        }

        console.log("Adding new node!", addr);
        this.nodes.push(new Neighbour(addr));

        if (informOthers === true) {
            this.postToNeighbours(100, "/node/new", { addr: addr }, exclude);
        }
    }

    getNodes(): string[] {
        return this.nodes.map(n => n.address);
    }

    public postToNeighbours(count: number, path: string, data: any, exclude: string[]) {
        const upNodes = this.nodes.filter(n => n.isDown == false);

        if (exclude == null) {
            exclude = [];
        }

        exclude.push(this.myAddr);

        const message: Message = {
            header: {
                excludeNodes: exclude
            },
            data: data
        }

        const nodesToSend: Neighbour[] = [];

        for (let i = 0; i < count; i++) {
            if (upNodes.length <= i) {
                break;
            }

            const node = upNodes[i];

            if (exclude.indexOf(node.address) > -1) {
                count++;
                continue;
            }

            nodesToSend.push(node);
        }

        message.header.excludeNodes.push(...nodesToSend.map(n => n.address));
        message.header.excludeNodes =
            message.header.excludeNodes.filter((value, index, self) => { 
                return self.indexOf(value) === index;
            });

        for (const node of nodesToSend) {
            this.postToNeighbour(node, path, message)
                .catch(() => {
                    node.isDown = true;
                });
        }
    }

    private async postToNeighbour(n: Neighbour, path: string, data: any) {
        return new Promise(function(resolve, reject){
            const addr = n.address + path;

            request.post(addr, { json: data }, 
                (error: any, response: request.Response, body: any) => {
                    if (!error && response.statusCode == 200) {
                        console.log("success to...",  n.address);
                        resolve();
                    } else {
                        console.log("falied to...",  n.address);
                        reject();
                    }
            });
        });
    }

}

class Neighbour {

    public isDown = false;

    constructor(public address: string) {

    }
}

class Message {
    header: MessageHeader = new MessageHeader();
    data: any;
}

export class MessageHeader {
    excludeNodes: string[] = [];
}