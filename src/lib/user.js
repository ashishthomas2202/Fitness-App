import connectDB from "@/db/db";
import User from "@/db/models/User";
import bcrypt from "bcrypt";
import FieldError from "@/lib/errors/FieldError";
import _ from "lodash";

export async function authenticate(email, password) {
  try {
    // getting the user from the database
    // const user = await getUser(email);
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      // No user found with this email
      return null;
    }

    if (!user.hashedPassword && user.googleId) {
      throw new Error(
        "Email is already registered with Google. Please Signin with Google."
      );
    }
    // Compare the provided password with the hashed password in the database
    const match = await bcrypt.compare(password, user.hashedPassword);

    if (match) {
      // Passwords match, return the user object (excluding the password hash)

      const { hashedPassword, __v, ...filteredUser } = user.toObject();

      return filteredUser;
    } else {
      // Passwords do not match
      return null;
    }
  } catch (error) {
    // Handle any errors that occur during the process
    throw error;
  }
}

// Function to hash a password using bcrypt
export async function hashPassword(password) {
  // Define the number of salt rounds for bcrypt
  //   const saltRounds = process.env.SALT_ROUNDS || 10;
  const saltRounds = 10;

  // Generate a salt and hash the password
  return await bcrypt.hash(password, saltRounds);
}

export async function createUser({ firstName, lastName, email, password }) {
  // Hash the password
  let hashedPassword = await hashPassword(password);

  // Insert the new user into the database
  const user = await User.findOne({
    email,
  });

  if (user) {
    throw new FieldError("email", "Email already exists");
  }

  const newUser = new User({
    firstName: _.startCase(firstName),
    lastName: _.startCase(lastName),
    email: email.toLowerCase(),
    hashedPassword: hashedPassword,
  });

  return await newUser.save();
}

export async function linkGoogleAuth({ email, name, googleId, picture }) {
  await connectDB();

  // Insert the new user into the database
  const user = await User.findOne({ email });
  if (user) {
    //check if the user has googleId
    if (!user.googleId) {
      user.googleId = googleId;
      if (user?.picture === null) {
        user.picture = picture;
      }
      await user.save();
    }
  } else {
    const newUser = new User({
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1],
      email: email,
      hashedPassword: null,
      googleId: googleId,
      picture: picture,
    });

    await newUser.save();
  }
}
