import { v4 as generateID, validate as uuidValidate } from 'uuid';
import { connectDB } from './helper.js';

const postAnswer = async (req, res) => {
  const questionId = req.params.id;
  const { content } = req.body;
  const user = req.user;

  if (!questionId || !uuidValidate(questionId)) {
    return res.status(400).send({ error: 'Invalid or missing question ID.' });
  }

  if (!content || content.trim().length < 10) {
    return res.status(400).send({ error: 'Answer must be at least 10 characters long.' });
  }

  const client = await connectDB();
  try {
    const questions = client.db('Forum').collection('questions');
    const question = await questions.findOne({ _id: questionId });
    if (!question) {
      return res.status(404).send({ error: 'Question not found.' });
    }

    const newAnswer = {
      _id: generateID(),
      questionId,
      userId: user._id,
      username: user.username,
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      edited: false
    };

    await client.db('Forum').collection('answers').insertOne(newAnswer);

    await questions.updateOne(
      { _id: questionId },
      { $set: { isAnswered: true } }
    );

    res.status(201).send({ success: 'Answer posted successfully.', answerData: newAnswer });

  } catch (err) {
    console.error('postAnswer error:', err);
    res.status(500).send({ error: 'Server error while posting answer.' });
  } finally {
    await client.close();
  }
};

const getAnswersByQuestionId = async (req, res) => {
  const questionId = req.params.id;

  if (!uuidValidate(questionId)) {
    return res.status(400).send({ error: 'Invalid question ID format.' });
  }

  const client = await connectDB();
  try {
    const answers = await client
      .db('Forum')
      .collection('answers')
      .find({ questionId })
      .sort({ createdAt: 1 })
      .toArray();

    res.send(answers);

  } catch (err) {
    console.error('getAnswersByQuestionId error:', err);
    res.status(500).send({ error: 'Server error while retrieving answers.' });
  } finally {
    await client.close();
  }
};

const editAnswer = async (req, res) => {
  const answerId = req.params.id;
  const { content } = req.body;
  const user = req.user;

  if (!uuidValidate(answerId)) {
    return res.status(400).send({ error: 'Invalid answer ID format.' });
  }

  if (!content || content.trim().length < 10) {
    return res.status(400).send({ error: 'Answer must be at least 10 characters.' });
  }

  const client = await connectDB();
  try {
    const answers = client.db('Forum').collection('answers');
    const existing = await answers.findOne({ _id: answerId });

    if (!existing) {
      return res.status(404).send({ error: 'Answer not found.' });
    }

    if (existing.userId !== user._id) {
      return res.status(403).send({ error: 'You are not allowed to edit this answer.' });
    }

    await answers.updateOne(
      { _id: answerId },
      {
        $set: {
          content: content.trim(),
          edited: true,
          updatedAt: new Date()
        }
      }
    );

    const updated = await answers.findOne({ _id: answerId });
    res.send({ success: 'Answer updated successfully.', answerData: updated });

  } catch (err) {
    console.error('editAnswer error:', err);
    res.status(500).send({ error: 'Server error while editing answer.' });
  } finally {
    await client.close();
  }
};

const deleteAnswer = async (req, res) => {
  const answerId = req.params.id;
  const user = req.user;

  if (!uuidValidate(answerId)) {
    return res.status(400).send({ error: 'Invalid answer ID format.' });
  }

  const client = await connectDB();
  try {
    const db = client.db('Forum');
    const answers = db.collection('answers');
    const questions = db.collection('questions');

    const answer = await answers.findOne({ _id: answerId });

    if (!answer) {
      return res.status(404).send({ error: 'Answer not found.' });
    }

    if (answer.userId !== user._id) {
      return res.status(403).send({ error: 'You are not allowed to delete this answer.' });
    }

    // Delete the answer
    await answers.deleteOne({ _id: answerId });

    // Check if any answers remain for the same question
    const remainingAnswersCount = await answers.countDocuments({ questionId: answer.questionId });

    // If no more answers, update isAnswered to false
    if (remainingAnswersCount === 0) {
      await questions.updateOne(
        { _id: answer.questionId },
        { $set: { isAnswered: false } }
      );
    }

    res.send({ success: 'Answer deleted successfully.' });

  } catch (err) {
    console.error('deleteAnswer error:', err);
    res.status(500).send({ error: 'Server error while deleting answer.' });
  } finally {
    await client.close();
  }
};

export {
  postAnswer,
  getAnswersByQuestionId,
  editAnswer,
  deleteAnswer
};