import db from "@repo/db/client"

export default async function generateUniqueName(userId: number) {
    const flows = await db.flow.findMany({
        where: {
            userId,
            name: {
                startsWith: "Untitled"
            }
        },
        select: {
            name: true
        }
    });

    if (flows.length === 0) return "Untitled"


    const existingNumbers = flows
        .map(flow => flow.name.match(/^Untitled-(\d+)$/)?.[1])
        .filter(Boolean)
        .map(Number)
        .sort((a, b) => a - b);

    let count = 1;
    for (const num of existingNumbers) {
        if (num !== count) break;
        count++;
    }

    return `Untitled-${count}`
}