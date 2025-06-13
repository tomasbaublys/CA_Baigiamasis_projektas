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

const register = async (req, res) => {
    try {
        
    } catch (error) {
        
    } finally {
        await client.close();
    }
}

export { login, register };
