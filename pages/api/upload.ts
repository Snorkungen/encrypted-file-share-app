// import pool from '../../lib/db';
import createId from '../../lib/createId';
import type { NextApiRequest, NextApiResponse } from 'next'
import Chunk from '../../lib/models/chunk.model';

export interface UploadBody {
    id: string;
    data: string;
    count: number;
}

export interface UploadResponse {
    id: string;
    chunkSize: number;
}

const CHUNK_SIZE = 2 * 16 * 1000 * 8;

export default async function uploadHandler(req: NextApiRequest, res: NextApiResponse<UploadResponse>) {
    if (req.method == "GET") {
        let query = await Chunk.count({
            group: "file_id"
        });

        let id = createId(query.length || 0);

        return res.json({
            id,
            chunkSize: CHUNK_SIZE
        })
    } else if (req.method = "POST") {
        const { id, data, count } = req.body as UploadBody;

        if (id === undefined) return res.status(400).end();
        if (data === undefined) return res.status(400).end();
        if (count === undefined) return res.status(400).end();

        await Chunk.create({
            file_id: id,
            count,
            data,
            length: data.length
        });

        return res.status(204).end();
    }
}
