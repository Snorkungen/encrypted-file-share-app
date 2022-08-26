import pool from '../../lib/db';
import createId from '../../lib/createId';
import type { NextApiRequest, NextApiResponse } from 'next'

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

export default async function uploadHandler (req: NextApiRequest, res: NextApiResponse<UploadResponse>)  {
    if (req.method == "GET") {

        let query = await pool.query("SELECT COUNT(*) FROM chunks GROUP BY file_id");
        let id = createId(query.rows.length ? Number(query.rowCount) : 0);

        return res.json({
            id,
            chunkSize: CHUNK_SIZE
        })
    } else if (req.method = "POST") {
        const { id, data, count } = req.body as UploadBody;

        if (id === undefined) return res.status(400).end();
        if (data === undefined) return res.status(400).end();
        if (count === undefined) return res.status(400).end();

        await pool.query("INSERT INTO chunks(file_id,count,data,length) VALUES ($1, $2, $3,$4)", [id, count, data, data.length]);
        return res.status(204).end();
    }
}
