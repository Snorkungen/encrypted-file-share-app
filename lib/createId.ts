const ID_LENGTH = 16;

export default function createId(num: number, id_len = ID_LENGTH) {
    if (id_len > 98) throw "ID length to large; max size 98";

    let id = num.toString(16)
    id += Math.random().toFixed(id_len - id.length + 2).substring(2)

    return id;
}
