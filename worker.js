export default {
    async fetch(request, env, ctx) {

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "*"
        };

        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: corsHeaders
            });
        }

        const url = new URL(request.url);

        if (url.pathname === "/api/agenda") {

            const { results } = await env.DB.prepare(
                "SELECT * FROM agenda"
            ).all();

            return new Response(JSON.stringify(results), {
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                }
            });
        }

        return new Response("Worker running", {
            headers: corsHeaders
        });
    }
};