import assert from "node:assert/strict";
import test from "node:test";

import { Environment } from "../js/environment.js";
import { MapStorage } from "../js/mapStorage.js";

test("MapStorage calls the file storage API for list, save, load, and delete", async () => {
  const requests = [];
  const environment = new Environment({ gridSizeX: 5, gridSizeY: 6 });
  const fetchImpl = async (url, options = {}) => {
    requests.push({ url, options });

    if (options.method === "POST") {
      return jsonResponse(201, { name: "Room map", overwritten: false });
    }

    if (options.method === "DELETE") {
      return jsonResponse(200, { removed: true });
    }

    if (url.endsWith("/Room%20map")) {
      return jsonResponse(200, { state: { robot: {}, map: {}, config: {} } });
    }

    return jsonResponse(200, { maps: [{ name: "Room map" }] });
  };
  const storage = new MapStorage({ fetchImpl, baseUrl: "/api/maps" });

  assert.deepEqual(await storage.list(), [{ name: "Room map" }]);
  assert.deepEqual(
    await storage.save("  Room   map  ", environment.getInitialState()),
    { name: "Room map", overwritten: false }
  );
  assert.deepEqual(await storage.load("Room map"), {
    robot: {},
    map: {},
    config: {},
  });
  assert.equal(await storage.remove("Room map"), true);

  const saveRequest = requests[1];
  const saveBody = JSON.parse(saveRequest.options.body);
  assert.equal(saveRequest.url, "/api/maps");
  assert.equal(saveRequest.options.method, "POST");
  assert.equal(saveBody.name, "Room map");
  assert.equal(saveBody.state.map.grid_size_x, 5);
  assert.equal(requests[2].url, "/api/maps/Room%20map");
  assert.equal(requests[3].options.method, "DELETE");
});

test("MapStorage reports when the project server is unavailable", async () => {
  const storage = new MapStorage({
    fetchImpl: async () => {
      throw new Error("offline");
    },
    baseUrl: "/api/maps",
  });

  await assert.rejects(() => storage.list(), /offline/);
});

function jsonResponse(status, value) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return value;
    },
  };
}
