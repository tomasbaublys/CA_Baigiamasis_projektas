import bcrypt from 'bcrypt';
import { v4 as generateID, validate as uuidValidate } from 'uuid';
import { connectDB, generateAccessToken, verifyRefreshToken, generateRefreshToken } from './helper.js';

const login = async (req, res) => {
  const client = await connectDB();
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required.' });
    }

    const DB_RESPONSE = await client.db('Forum').collection('users').findOne({ email });
    if (!DB_RESPONSE) {
      return res.status(401).send({ error: 'Invalid login credentials.' });
    }

    const { password: hashedPassword, _id, ...user } = DB_RESPONSE;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid login credentials.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res
      .header('Authorization', accessToken)
      .send({
        success: `[${user.email}] logged in successfully.`,
        userData: user,
        accessToken,
        refreshToken
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

const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).send({ error: 'Token does not exist.' });
  }

  try {
    const decoded = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken({
      email: decoded.email,
      username: decoded.username,
    });

    res.send({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    res.status(403).send({ error: 'Invalid or expired refresh token.' });
  }
};

const register = async (req, res) => {
  const client = await connectDB();
  try {
    const { email, username, password, profilePicture } = req.body;

    if (!email || !username || !password) {
      return res.status(400).send({ error: 'Email, username, and password are required.' });
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).send({
        error: 'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.',
      });
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
      _id: generateID(),
      email,
      username,
      password: hashedPassword,
      profilePicture: profilePicture || '',
      createdAt: new Date().toISOString()
    };

    await client.db('Forum').collection('users').insertOne(newUser);

    const { password: _, _id, ...userData } = newUser;
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    res.status(201).header('Authorization', accessToken).send({
      success: `[${newUser.email}] was registered successfully.`,
      userData,
      accessToken,
      refreshToken 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  } finally {
    await client.close();
  }
};

const getUserId = async (req, res) => {
  const client = await connectDB();
  try {
    const { email } = req.user;

    const DB_RESPONSE = await client.db('Forum').collection('users').findOne({ email });

    if (!DB_RESPONSE) {
      console.warn(`User not found for email: ${email}`);
      return res.status(404).send({ error: 'User not found.' });
    }

    res.send({
      success: 'User ID fetched successfully.',
      id: DB_RESPONSE._id // <- changed from userId to id
    });
  } catch (err) {
    console.error('getUserId error:', err);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  } finally {
    await client.close();
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!uuidValidate(id)) {
    return res.status(400).send({ error: 'Invalid user ID format.' });
  }

  const disallowedFields = ['_id', 'email'];
  for (const key of disallowedFields) {
    if (req.body[key]) {
      return res.status(400).send({ error: `Editing '${key}' is not allowed.` });
    }
  }

  const client = await connectDB();
  try {
    const users = client.db('Forum').collection('users');
    const existingUser = await users.findOne({ _id: id });

    if (!existingUser) {
      return res.status(404).send({ error: 'User not found.' });
    }

    const fieldsToUpdate = ['username', 'profilePicture', 'password']
      .filter((key) => req.body[key])
      .reduce((acc, key) => {
        acc[key] = req.body[key];
        return acc;
      }, {});

    if (fieldsToUpdate.password) {
      if (!req.body.oldPassword) {
        return res.status(400).send({ error: 'Old password is required to change password.' });
      }

      const passwordsMatch = await bcrypt.compare(req.body.oldPassword, existingUser.password);
      if (!passwordsMatch) {
        return res.status(400).send({ error: 'Incorrect old password.' });
      }

      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordPattern.test(fieldsToUpdate.password)) {
        return res.status(400).send({
          error: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
        });
      }

      fieldsToUpdate.password = await bcrypt.hash(fieldsToUpdate.password, 12);
    }

    const result = await users.updateOne({ _id: id }, { $set: fieldsToUpdate });
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: 'User not found.' });
    }

    const updatedUser = await users.findOne({ _id: id });
    const { password, _id, ...userData } = updatedUser;
    const accessToken = generateAccessToken(userData);

    res.header('Authorization', accessToken).send({
      success: 'User updated successfully.',
      updatedToken: accessToken
    });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).send({ error: 'Server error. Please try again later.' });
  } finally {
    await client.close();
  }
};

export {
  login,
  loginAuto,
  refreshToken,
  register,
  getUserId,
  updateUser
};