import fs from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();

process.env.JWT_SECRET ||= "test-jwt-secret-for-unit-tests-only";
process.env.NEXT_PUBLIC_SUPABASE_URL ||= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_KEY ||= "test-service-key";

function resolveCandidateFile(basePath) {
    const candidates = [
        basePath,
        `${basePath}.ts`,
        `${basePath}.tsx`,
        `${basePath}.mts`,
        `${basePath}.js`,
        `${basePath}.mjs`,
        path.join(basePath, "index.ts"),
        path.join(basePath, "index.tsx"),
        path.join(basePath, "index.js"),
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            return candidate;
        }
    }
    return null;
}

registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier.startsWith("@/")) {
            const target = path.join(rootDir, specifier.slice(2));
            const resolved = resolveCandidateFile(target);
            if (resolved) {
                return {
                    shortCircuit: true,
                    url: pathToFileURL(resolved).href,
                };
            }
        }

        if (specifier === "next/server") {
            const nextServerPath = path.join(rootDir, "node_modules", "next", "server.js");
            return {
                shortCircuit: true,
                url: pathToFileURL(nextServerPath).href,
            };
        }

        return nextResolve(specifier, context);
    },
});
