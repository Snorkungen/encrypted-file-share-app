import type { NextApiRequest, NextApiResponse } from 'next'
import Chunk from '../../lib/models/chunk.model';

export type DownloadQuery = {
    id?: string;
    count?: number;
}

export default async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        let { id, count } = req.query as DownloadQuery;
        if (id == undefined) return res.status(400).end()
        if (count == undefined) return res.status(400).end()

        try {
            Chunk.sync();

            let query = await Chunk.findOne({
                attributes: ["file_id", "data", "length"],
                where: {
                    file_id: id,
                    count
                }
            });

            if (!query) return res.status(404).end()

            return res.json(query);
        } catch (error) {
            return res.status(500).end()
        }
    }
}
