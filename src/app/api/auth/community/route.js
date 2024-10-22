export async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("yourDatabase");
  
    if (req.method === 'POST') {
      const { name, description } = req.body;
      try {
        const result = await db.collection("communities").insertOne({
          name,
          description,
          createdAt: new Date(),
        });
        return res.status(201).json(result.ops[0]);
      } catch (error) {
        return res.status(500).json({ error: "Failed to create community" });
      }
    }
  
    if (req.method === 'GET') {
      try {
        const communities = await db.collection("communities").find({}).toArray();
        return res.status(200).json({ communities });
      } catch (error) {
        return res.status(500).json({ error: "Failed to fetch communities" });
      }
    }
  
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  export default handler;