import bcrypt from 'bcrypt';
import User from './users.schema';
import { IUser } from './users.type';
import { generateAccessToken } from '../../../helpers/jwtHelper';

class UserService {
  // Register a new user
  async register(name: string, email: string, password: string): Promise<IUser | null> {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();
    return newUser;
  }

  // Login a user
  async login(email: string, password: string): Promise<{ user: IUser; token: string } | null> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Invalid email or password');

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    // Generate access token
    const token = generateAccessToken(user._id, user.role, user.name, user.email);

    if (user && token) {
      return { user, token };
    } else {
      return null;
    }
  }

  // Fetch user by ID
  async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
}

export default new UserService();
