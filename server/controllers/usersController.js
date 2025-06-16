import bcrypt from 'bcrypt';
import { connectDB, generateAccessToken } from './helper.js';

const login = async (req, res) => {
  const client = await connectDB();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required.' });
    }

    const DB_RESPONSE = await client.db('Forum').collection('users').findOne({ email });

    if (!DB_RESPONSE) {
      console.warn({ error: `Login failed: no user with email [${email}]` });
      return res.status(401).send({ error: 'Invalid login credentials.' });
    }

    const { password: hashedPassword, _id, ...user } = DB_RESPONSE;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      console.warn({ error: `Login failed: incorrect password for [${email}]` });
      return res.status(401).send({ error: 'Invalid login credentials.' });
    }

    const accessToken = generateAccessToken(user);

    res
      .header('Authorization', accessToken)
      .send({
        success: `[${user.email}] logged in successfully.`,
        userData: user
      });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  } finally {
    await client.close();
  }
};

const loginAuto = (req, res) => {
  res.send({
    success: `User [${req.user.email}] re-authenticated.`,
    userData: req.user,
  });
};

const register = async (req, res) => {
  const client = await connectDB();

  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).send({ error: 'Email, username, and password are required.' });
    }

    const DB_RESPONSE = await client.db('Forum').collection('users').findOne({
      $or: [{ email }, { username }]
    });

    if (DB_RESPONSE) {
      if (DB_RESPONSE.email === email && DB_RESPONSE.username === username) {
        return res.status(409).send({ error: `Email and username already in use.` });
      } else if (DB_RESPONSE.email === email) {
        return res.status(409).send({ error: `Email already in use.` });
      } else if (DB_RESPONSE.username === username) {
        return res.status(409).send({ error: `Username already in use.` });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      email,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    await client.db('Forum').collection('users').insertOne(newUser);

    const { password: _, _id, ...userData } = newUser;
    const accessToken = generateAccessToken(userData);

    res.status(201).header('Authorization', accessToken).send({
      success: `[${newUser.email}] was registered successfully.`,
      userData
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  } finally {
    await client.close();
  }
};

export { login, loginAuto, register };
