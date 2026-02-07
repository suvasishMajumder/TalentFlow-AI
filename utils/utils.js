
export const ok = (res, data) => {
  return res.status(200).json({ success: true, data: data, error: null });
};

export const badReq = (res, msg) => {
  return res.status(400).json({
    success: false,
    data: null,
    error: { message: msg || "Bad Request" },
  });
};

export const notFound = (res, msg) => {
  return res.status(404).json({
    success: false,
    data: null,
    error: { message: msg || "Not Found 404" },
  });
};

export const created = (res, data) => {
  return res.status(201).json({ success: true, data: data, error: null });
};

export const serverfail = (res, msg) => {
  return res.status(500).json({
    success: false,
    data: null,
    error: { message: msg || "Internal Server Error" },
  });
};

export const conflict = (res, msg) => {
  return res.status(409).json({
    success: false,
    data: null,
    error: { message: msg || "Conflict" },
  });
};

export const tooManyRequests = (res, msg) => {
  return res.status(429).json({
    success: false,
    data: null,
    error: { message: msg || "Internal Server Error" },
  });
};

export const forbidden = (res, msg) => {
  return res.status(403).json({
    success: false,
    data: null,
    error: { message: msg || "Insufficient Permissions" },
  });
};

export const unauthorized = (res, msg="Unauthorized") => {
  return res
    .status(401)
    .json({
      success: false,
      data: null,
      error: { message: msg || "Unauthorized" },
    });
};


export const convertBigInt = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(convertBigInt);
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj === "object") {
    const out = {};
    for (const k of Object.keys(obj)) {
      out[k] = convertBigInt(obj[k]);
    }
    return out;
  }
  return obj;
}


export const noContent = (res) => {
  return res.status(204).end();
};
