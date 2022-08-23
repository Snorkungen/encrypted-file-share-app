const ID_LENGTH = 30;

export default function createId(num: number) {
    let buffer = (Buffer.from(num + "")).toString("hex");
    let id = ""

    for (let i = 0; i < ID_LENGTH - buffer.length; i++) {
        id += "A"
    }

    return id + buffer;
}