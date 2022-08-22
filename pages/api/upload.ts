import type { NextApiRequest, NextApiResponse } from 'next'

export interface UploadQuery {
    size?: number;
}

export interface UploadBody {
    id: string;
    data: string;
    count: number;
}

export interface UploadResponse {
    id: string;
    chunkSize: number;
    chunkCount: number;
}

const CHUNK_SIZE = 2 * 16000 * 8;


export default (req: NextApiRequest, res: NextApiResponse<UploadResponse>) => {
    if (req.method == "GET") {
        const { size } = req.query as UploadQuery

        if (!size) {
            return res.status(400).end();
        }

        let id = Math.random().toPrecision(10);

        return res.json({
            id,
            chunkSize: CHUNK_SIZE,
            chunkCount: Math.ceil(size / CHUNK_SIZE)
        })
    } else if (req.method = "POST") {



        return res.status(204).end();
    }




}
