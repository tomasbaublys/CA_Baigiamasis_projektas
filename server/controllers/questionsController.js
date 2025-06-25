import { v4 as generateID, validate as uuidValidate } from 'uuid';
import { connectDB, dynamicQuery, addCountToDocuments } from './helper.js';

// CREATE QUESTION
const createQuestion = async (req, res) => {
  const { title, description, tags, author } = req.body;

  if (!title || !description || !author || !author._id || !author.username) {
    return res.status(400).send({ error: 'Required fields: title, description, author._id, author.username.' });
  }

  if (!uuidValidate(author._id)) {
    return res.status(400).send({ error: `Invalid author ID format: ${author._id}` });
  }

  if (title.trim().length < 5) {
    return res.status(400).send({ error: 'Title must be at least 5 characters.' });
  }

  if (title.trim().length > 120) {
    return res.status(400).send({ error: 'Title must not exceed 120 characters.' });
  }

  if (description.trim().length < 30) {
    return res.status(400).send({ error: 'Description must be at least 30 characters.' });
  }

  if (description.trim().length > 5000) {
    return res.status(400).send({ error: 'Description must not exceed 5000 characters.' });
  }

  if (tags && !Array.isArray(tags)) {
    return res.status(400).send({ error: 'Tags must be an array.' });
  }

  const client = await connectDB();
  try {
    const user = await client.db('Forum').collection('users').findOne({ _id: author._id });
    if (!user) {
      return res.status(404).send({ error: 'Author not found.' });
    }

    const newQuestion = {
      _id: generateID(),
      title: title.trim(),
      description: description.trim(),
      tags: tags ? tags.map(t => t.trim()) : [],
      author: {
        _id: user._id,
        username: user.username,
        profilePicture: user.profilePicture || ''
      },
      score: 0,
      likes: [],
      dislikes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await client.db('Forum').collection('questions').insertOne(newQuestion);
    res.status(201).send({ success: 'Question created.', questionData: newQuestion });

  } catch (err) {
    console.error('createQuestion error:', err);
    res.status(500).send({ error: 'Something went wrong on the server.' });
  } finally {
    await client.close();
  }
};

// GET ALL QUESTIONS
const getAllQuestions = async (req, res) => {
  const client = await connectDB();
  try {
    const settings = dynamicQuery(req.query);

    const data = await client
      .db('Forum')
      .collection('questions')
      .find(settings.filter)
      .sort(settings.sort)
      .skip(settings.skip)
      .limit(settings.limit)
      .toArray();

    const dataWithCount = await addCountToDocuments(client, {
      dbName: 'Forum',
      sourceDocs: data,
      matchCollection: 'answers',
      matchField: 'questionId',
      countFieldName: 'answersCount'
    });

    res.send(dataWithCount);
  } catch (err) {
    console.error('getAllQuestions error:', err);
    res.status(500).send({ error: `Server error. ${err}` });
  } finally {
    await client.close();
  }
};

const getQuestionById = async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!uuidValidate(id)) {
    return res.status(400).send({ error: `Invalid question ID format: ${id}` });
  }

  const client = await connectDB();
  try {
    const question = await client.db('Forum').collection('questions').findOne({ _id: id });

    if (!question) {
      return res.status(404).send({ error: `Question not found for ID: ${id}` });
    }

    res.send(question);

  } catch (err) {
    console.error('getQuestionById error:', err);
    res.status(500).send({ error: 'Server error while retrieving question.' });
  } finally {
    await client.close();
  }
};

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  if (!uuidValidate(id)) {
    return res.status(400).send({ error: `Invalid question ID format.` });
  }

  const disallowedFields = ['_id', 'author', 'score', 'likes', 'dislikes', 'createdAt'];
  for (const key of disallowedFields) {
    if (req.body[key] !== undefined) {
      return res.status(400).send({ error: `Editing '${key}' is not allowed.` });
    }
  }

  const updates = {};

  if (title) {
    if (typeof title !== 'string' || title.trim().length < 5 || title.trim().length > 120) {
      return res.status(400).send({ error: 'Title must be 5–120 characters.' });
    }
    updates.title = title.trim();
  }

  if (description) {
    if (typeof description !== 'string' || description.trim().length < 30 || description.trim().length > 5000) {
      return res.status(400).send({ error: 'Description must be 30–5000 characters.' });
    }
    updates.description = description.trim();
  }

  if (tags) {
    if (!Array.isArray(tags)) {
      return res.status(400).send({ error: 'Tags must be an array.' });
    }
    updates.tags = tags.map(t => t.trim()).filter(Boolean);
  }

  if (!Object.keys(updates).length) {
    return res.status(400).send({ error: 'No valid fields provided for update.' });
  }

  updates.updatedAt = new Date().toISOString();

  const client = await connectDB();
  try {
    const questions = client.db('Forum').collection('questions');

    const existing = await questions.findOne({ _id: id });
    if (!existing) {
      return res.status(404).send({ error: 'Question not found.' });
    }

    await questions.updateOne({ _id: id }, { $set: updates });
    const updatedQuestion = await questions.findOne({ _id: id });

    res.send({
      success: 'Question updated successfully.',
      questionData: updatedQuestion
    });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  } finally {
    await client.close();
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  if (!uuidValidate(id)) {
    return res.status(400).send({ error: 'Invalid question ID format.' });
  }

  const client = await connectDB();
  try {
    const questions = client.db('Forum').collection('questions');
    const question = await questions.findOne({ _id: id });

    if (!question) {
      return res.status(404).send({ error: 'Question not found.' });
    }

    if (question.author._id !== req.user._id) {
      return res.status(403).send({ error: 'You do not have permission to delete this question.' });
    }

    await questions.deleteOne({ _id: id });
    res.send({ success: 'Question deleted successfully.' });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  } finally {
    await client.close();
  }
};

export {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
};