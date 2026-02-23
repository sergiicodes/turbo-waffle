export default {
    async fetch(request, env, ctx) {

        const url = new URL(request.url);

        if (url.pathname === "/api/agenda") {

            const { results } = await env.DB.prepare(
                "SELECT * FROM agenda ORDER BY date DESC"
            ).all();

            return Response.json(results);
        }

        return new Response("Worker running");
    }
};