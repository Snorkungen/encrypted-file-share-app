import pool from '../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'

export type DownloadQuery = {
    id?: string;
    count?: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "GET") {
        let { id, count } = req.query as DownloadQuery;
        if (id == undefined) return res.status(400).end()
        if (count == undefined) return res.status(400).end()

        let query = await pool.query("SELECT file_id,count,data, length FROM chunks WHERE file_id=$1 AND count=$2", [id, count])

        if (query.rowCount !== 1) return res.status(404).end()


        return res.json(query.rows[0]);
    }
}
