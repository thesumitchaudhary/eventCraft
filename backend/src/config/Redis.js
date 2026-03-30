import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

// If Redis URL is missing, keep app features working and skip cache.
const createDisabledRedisClient = () => ({
	status: "disabled",
	get: async () => null,
	set: async () => null,
	del: async () => 0,
	on: () => null,
});

let redis;

if (!redisUrl) {
	console.warn("REDIS_URL is not set. Redis cache is disabled.");
	redis = createDisabledRedisClient();
} else {
	const client = new Redis(redisUrl, {
		lazyConnect: true,
		enableOfflineQueue: false,
		maxRetriesPerRequest: 1,
		retryStrategy: () => null,
	});

	let cacheEnabled = true;
	let unavailableLogged = false;

	const disableCache = (message) => {
		if (!cacheEnabled) {
			return;
		}
		cacheEnabled = false;
		if (!unavailableLogged) {
			console.warn(message);
			unavailableLogged = true;
		}
		client.disconnect();
	};

	client.on("error", (err) => {
		disableCache(`Redis connection error: ${err.message}`);
	});

	redis = {
		on: (...args) => client.on(...args),
		get status() {
			return cacheEnabled ? client.status : "disabled";
		},
		async get(key) {
			if (!cacheEnabled) {
				return null;
			}
			try {
				return await client.get(key);
			} catch (err) {
				disableCache(`Redis disabled after read error: ${err.message}`);
				return null;
			}
		},
		async set(...args) {
			if (!cacheEnabled) {
				return null;
			}
			try {
				return await client.set(...args);
			} catch (err) {
				disableCache(`Redis disabled after write error: ${err.message}`);
				return null;
			}
		},
		async del(...args) {
			if (!cacheEnabled) {
				return 0;
			}
			try {
				return await client.del(...args);
			} catch (err) {
				disableCache(`Redis disabled after delete error: ${err.message}`);
				return 0;
			}
		},
	};
}

export default redis;