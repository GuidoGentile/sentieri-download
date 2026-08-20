(function exposeManagerTrailGeometryModel(root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.SentieriManagerTrailGeometryModel = Object.freeze(api);
})(typeof globalThis !== "undefined" ? globalThis : this, function createManagerTrailGeometryModel() {
  "use strict";

  const EARTH_RADIUS_METERS = 6371008.8;

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function validCoordinate(coordinate) {
    return Array.isArray(coordinate)
      && coordinate.length >= 2
      && Number.isFinite(Number(coordinate[0]))
      && Number.isFinite(Number(coordinate[1]))
      && Number(coordinate[0]) >= -180
      && Number(coordinate[0]) <= 180
      && Number(coordinate[1]) >= -90
      && Number(coordinate[1]) <= 90;
  }

  function cleanCoordinate(coordinate) {
    const cleaned = [Number(coordinate[0]), Number(coordinate[1])];
    if (Number.isFinite(Number(coordinate[2]))) cleaned.push(Number(coordinate[2]));
    return cleaned;
  }

  function geometrySegments(input) {
    if (!input || typeof input !== "object") return [];
    if (input.type === "FeatureCollection") {
      return input.features.flatMap((feature) => geometrySegments(feature));
    }
    if (input.type === "Feature") return geometrySegments(input.geometry);
    if (input.type === "LineString") return [input.coordinates];
    if (input.type === "MultiLineString") return input.coordinates;
    return [];
  }

  function normalizeGeoJson(input) {
    const segments = geometrySegments(input)
      .map((segment) => Array.isArray(segment) ? segment.filter(validCoordinate).map(cleanCoordinate) : [])
      .filter((segment) => segment.length >= 2);
    if (!segments.length) throw new Error("GEOMETRY_REQUIRED");
    return { type: "MultiLineString", coordinates: segments };
  }

  function attributeValue(attributes, name) {
    const match = String(attributes).match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"));
    return match ? number(match[1]) : null;
  }

  function pointsFromGpxFragment(fragment, tagName) {
    const points = [];
    const pointPattern = new RegExp(`<\\s*(?:[\\w.-]+:)?${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/\\s*(?:[\\w.-]+:)?${tagName}\\s*>`, "gi");
    let match;
    while ((match = pointPattern.exec(fragment))) {
      const latitude = attributeValue(match[1], "lat");
      const longitude = attributeValue(match[1], "lon");
      if (latitude === null || longitude === null) continue;
      const elevationMatch = match[2].match(/<\s*(?:[\w.-]+:)?ele\b[^>]*>\s*([-+]?\d+(?:\.\d+)?)\s*<\/\s*(?:[\w.-]+:)?ele\s*>/i);
      const coordinate = [longitude, latitude];
      if (elevationMatch && number(elevationMatch[1]) !== null) coordinate.push(number(elevationMatch[1]));
      if (validCoordinate(coordinate)) points.push(coordinate);
    }
    return points;
  }

  function parseGpx(text) {
    const source = String(text || "");
    if (!/<\s*(?:[\w.-]+:)?gpx\b/i.test(source)) throw new Error("INVALID_GPX");
    const segments = [];
    const segmentPattern = /<\s*(?:[\w.-]+:)?trkseg\b[^>]*>([\s\S]*?)<\/\s*(?:[\w.-]+:)?trkseg\s*>/gi;
    let match;
    while ((match = segmentPattern.exec(source))) {
      const points = pointsFromGpxFragment(match[1], "trkpt");
      if (points.length >= 2) segments.push(points);
    }
    if (!segments.length) {
      const trackPoints = pointsFromGpxFragment(source, "trkpt");
      if (trackPoints.length >= 2) segments.push(trackPoints);
    }
    const routePoints = pointsFromGpxFragment(source, "rtept");
    if (routePoints.length >= 2) segments.push(routePoints);
    if (!segments.length) throw new Error("GEOMETRY_REQUIRED");
    return { type: "MultiLineString", coordinates: segments };
  }

  function parseFileText(text, fileName = "") {
    const extension = String(fileName).toLowerCase().split(".").pop();
    if (extension === "gpx" || /^\s*</.test(String(text))) return parseGpx(text);
    try {
      return normalizeGeoJson(JSON.parse(text));
    } catch (error) {
      if (error.message === "GEOMETRY_REQUIRED") throw error;
      throw new Error("INVALID_GEOJSON");
    }
  }

  function radians(value) {
    return value * Math.PI / 180;
  }

  function distanceMeters(a, b) {
    const dLat = radians(b[1] - a[1]);
    const dLon = radians(b[0] - a[0]);
    const lat1 = radians(a[1]);
    const lat2 = radians(b[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function pointSegmentDistanceMeters(point, start, end) {
    const latitude = radians((start[1] + end[1] + point[1]) / 3);
    const scaleX = Math.cos(latitude) * Math.PI * EARTH_RADIUS_METERS / 180;
    const scaleY = Math.PI * EARTH_RADIUS_METERS / 180;
    const px = (point[0] - start[0]) * scaleX;
    const py = (point[1] - start[1]) * scaleY;
    const ex = (end[0] - start[0]) * scaleX;
    const ey = (end[1] - start[1]) * scaleY;
    const denominator = ex * ex + ey * ey;
    const t = denominator ? Math.max(0, Math.min(1, (px * ex + py * ey) / denominator)) : 0;
    return Math.hypot(px - t * ex, py - t * ey);
  }

  function simplifySegment(segment, toleranceMeters) {
    if (segment.length <= 2 || toleranceMeters <= 0) return segment.map((coordinate) => [...coordinate]);
    const keep = new Uint8Array(segment.length);
    keep[0] = 1;
    keep[segment.length - 1] = 1;
    const stack = [[0, segment.length - 1]];
    while (stack.length) {
      const [startIndex, endIndex] = stack.pop();
      let maximum = toleranceMeters;
      let selected = -1;
      for (let index = startIndex + 1; index < endIndex; index += 1) {
        const distance = pointSegmentDistanceMeters(segment[index], segment[startIndex], segment[endIndex]);
        if (distance > maximum) {
          maximum = distance;
          selected = index;
        }
      }
      if (selected !== -1) {
        keep[selected] = 1;
        stack.push([startIndex, selected], [selected, endIndex]);
      }
    }
    return segment.filter((_, index) => keep[index]).map((coordinate) => [...coordinate]);
  }

  function pointCount(geometry) {
    return geometry.coordinates.reduce((total, segment) => total + segment.length, 0);
  }

  function simplifyForEditing(geometry, maximumPoints = 600) {
    const normalized = normalizeGeoJson(geometry);
    if (pointCount(normalized) <= maximumPoints) return normalized;
    let lower = 0;
    let upper = 5;
    let candidate = normalized;
    while (upper < 10000) {
      candidate = { type: "MultiLineString", coordinates: normalized.coordinates.map((segment) => simplifySegment(segment, upper)) };
      if (pointCount(candidate) <= maximumPoints) break;
      upper *= 2;
    }
    for (let iteration = 0; iteration < 20; iteration += 1) {
      const tolerance = (lower + upper) / 2;
      const simplified = { type: "MultiLineString", coordinates: normalized.coordinates.map((segment) => simplifySegment(segment, tolerance)) };
      if (pointCount(simplified) > maximumPoints) lower = tolerance;
      else {
        upper = tolerance;
        candidate = simplified;
      }
    }
    return candidate;
  }

  function metrics(geometry) {
    const normalized = normalizeGeoJson(geometry);
    const all = normalized.coordinates.flat();
    let lengthMeters = 0;
    let elevationGainMeters = 0;
    let elevationLossMeters = 0;
    normalized.coordinates.forEach((segment) => {
      for (let index = 1; index < segment.length; index += 1) {
        lengthMeters += distanceMeters(segment[index - 1], segment[index]);
        if (segment[index - 1].length > 2 && segment[index].length > 2) {
          const change = segment[index][2] - segment[index - 1][2];
          if (change > 0) elevationGainMeters += change;
          else elevationLossMeters += Math.abs(change);
        }
      }
    });
    return {
      segmentCount: normalized.coordinates.length,
      pointCount: all.length,
      lengthMeters: Math.round(lengthMeters),
      elevationGainMeters: Math.round(elevationGainMeters),
      elevationLossMeters: Math.round(elevationLossMeters),
      hasElevation: all.some((coordinate) => coordinate.length > 2),
      bbox: [
        Math.min(...all.map((coordinate) => coordinate[0])),
        Math.min(...all.map((coordinate) => coordinate[1])),
        Math.max(...all.map((coordinate) => coordinate[0])),
        Math.max(...all.map((coordinate) => coordinate[1]))
      ]
    };
  }

  function reverse(geometry) {
    const normalized = normalizeGeoJson(geometry);
    return {
      type: "MultiLineString",
      coordinates: [...normalized.coordinates].reverse().map((segment) => [...segment].reverse().map((coordinate) => [...coordinate]))
    };
  }

  function setCoordinate(geometry, segmentIndex, pointIndex, longitude, latitude) {
    const normalized = normalizeGeoJson(geometry);
    const replacement = [Number(longitude), Number(latitude), ...(normalized.coordinates[segmentIndex][pointIndex].slice(2))];
    if (!validCoordinate(replacement)) throw new Error("INVALID_COORDINATE");
    normalized.coordinates[segmentIndex][pointIndex] = replacement;
    return normalized;
  }

  return {
    distanceMeters,
    metrics,
    normalizeGeoJson,
    parseFileText,
    parseGpx,
    pointCount,
    reverse,
    setCoordinate,
    simplifyForEditing
  };
});
