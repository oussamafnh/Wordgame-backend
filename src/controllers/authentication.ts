import express from 'express';
import { getUserByEmail, createUser, getUserBySessionToken } from '../db/user';

import { random, authentication } from '../helpers/index';


export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already taken'
      });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(password, salt)
      },
    });
    return res.status(201).json(user).end();
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user) {
      return res.status(400).json({
        message: 'User not found'
      });
    }
    const saltx = user.authentication.salt;
    const expectedHash = authentication(password, saltx);

    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({
        message: 'Wrong password'
      });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    // res.cookie('APP_AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
    const cookieParams = { httpOnly: true, sameSite: "none" as const, secure: false };
    res
      .cookie(
        'APP_AUTH',
        user.authentication.sessionToken,
        { ...cookieParams, expires: new Date(Date.now() + 25892000000) } // Set expiry of 1m
      );

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};


export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const { APP_AUTH } = req.cookies;

    if (!APP_AUTH) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    const user = await getUserBySessionToken(APP_AUTH);

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    user.authentication.sessionToken = null;
    await user.save();

    return res.clearCookie('APP_AUTH').status(200).json(user).end();
  } catch (err) {

    return res.status(500).json({
      message: err.message
    });
  }
};



export const profile = async (req: express.Request, res: express.Response) => {
  try {
    const { APP_AUTH } = req.cookies;

    if (!APP_AUTH) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    const user = await getUserBySessionToken(APP_AUTH);

    if(!user){
      throw new Error("The user was not found");
    }
    
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
}

