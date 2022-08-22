import type { NextApiRequest, NextApiResponse } from 'next'

export interface DownloadQuery {
    size?: number;
}

export interface DownloadResponse {
    id: string;
    chunkSize: number;
    chunkCount: number;
}

const CHUNK_SIZE = 1600 * 8;


export default (req: NextApiRequest, res: NextApiResponse<DownloadResponse>) => {
    if (req.method == "GET") {
        const { size } = req.method as DownloadQuery

        if (!size) {
            return res.status(400).end();
        }

        return res.json({
            id: "sda",
            chunkSize: CHUNK_SIZE,
            chunkCount: Math.ceil(size / CHUNK_SIZE)
        })
    }




}
