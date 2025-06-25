import { MongoClient } from "mongodb";
import jwt from 'jsonwebtoken';

const DB_CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/`;

export const connectDB = async () => {
  return await MongoClient.connect(DB_CONNECTION_STRING);
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "2d" });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const dynamicQuery = (reqQuery) => {
  const settings = {
    filter: {},
    sort: {},
    skip: 0,
    limit: 20
  };

  if (Object.keys(reqQuery).length) {
    Object.keys(reqQuery).forEach(key => {
      const [action, field, operator] = key.split('_');

      if (action === 'sort') {
        settings.sort[field] = Number(reqQuery[key]);
        settings.sort._id = 1;
      } else if (action === 'skip') {
        settings.skip = Number(reqQuery[key]);
      } else if (action === 'limit') {
        settings.limit = Number(reqQuery[key]);
      } else if (action === 'filter') {
        if (!operator) {
          if (/^true|^false/i.test(reqQuery[key])) {
            settings.filter[field] = /^true$/i.test(reqQuery[key]);
          } else {
            settings.filter[field] = { $regex: new RegExp(reqQuery[key], 'i') };
          }
        } else {
          const $operator = '$' + operator;
          if (operator === 'in' || operator === 'all') {
            settings.filter[field] = { [$operator]: reqQuery[key].split('_') };
          } else if (!settings.filter[field]) {
            settings.filter[field] = { [$operator]: Number(reqQuery[key]) };
          } else {
            settings.filter[field][$operator] = Number(reqQuery[key]);
          }
        }
      }
    });
  }

  return settings;
};

export const addCountToDocuments = async (client, {
  dbName,
  sourceDocs,
  matchCollection,
  matchField,
  groupField = matchField,
  countFieldName = 'count'
}) => {
  const ids = sourceDocs.map(doc => doc._id);

  const matchStage = {
    $match: {
      [matchField]: { $in: ids }
    }
  };

  const groupStage = {
    $group: {
      _id: `$${groupField}`,
      count: { $sum: 1 }
    }
  };

  const counts = await client
    .db(dbName)
    .collection(matchCollection)
    .aggregate([matchStage, groupStage])
    .toArray();

  const countsMap = Object.fromEntries(counts.map(entry => [entry._id, entry.count]));

  return sourceDocs.map(doc => ({
    ...doc,
    [countFieldName]: countsMap[doc._id] || 0
  }));
};