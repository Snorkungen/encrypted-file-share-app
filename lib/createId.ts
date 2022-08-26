const ID_LENGTH = 30;

export default function createId(num: number) {
    let buffer = (Buffer.from(num + "")).toString("hex");
    let id = "" + num + Math.random().toFixed(3).substring(2);

    return Buffer.from(id).toString("base64");
}