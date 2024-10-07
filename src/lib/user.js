import connectDB from "@/db/db";
import Profile from "@/db/models/Profile";

import User from "@/db/models/User";
import bcrypt from "bcrypt";
import FieldError from "@/lib/errors/FieldError";
import _ from "lodash";
// import { getServerSession } from "next-auth";
import { getServerAuthSession } from "@/lib/auth";

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

      const { hashedPassword, __v, ...filteredUser } = user.toJSON();

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

  await newUser.save();

  const newProfile = new Profile({
    userId: newUser.id,
  });
  await newProfile.save();

  //   const { hashedPassword: _, __v, ...filteredUser } = newUser.toJSON();
  const { hashedPassword: hash, __v, ...filteredUser } = newUser.toJSON();
  return filteredUser;
}

export async function linkGoogleAuth({ email, name, googleId, picture }) {
  try {
    await connectDB();

    // Insert the new user into the database
    const user = await User.findOne({ email });
    if (user) {
      //check if the user has googleId
      if (!user?.googleId) {
        console.log("User exists but no googleId");
        user.googleId = googleId;
        if (user?.picture === null) {
          user.picture = picture;
        }
        await user.save();
      }

      const { hashedPassword, __v, ...filteredUser } = user.toJSON();
      return filteredUser;
    } else {
      console.log("User does not exist");
      const newUser = new User({
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
        email: email,
        hashedPassword: null,
        googleId: googleId,
        picture: picture,
      });

      await newUser.save();
      const newProfile = new Profile({
        userId: newUser.id,
      });
      await newProfile.save();

      const { hashedPassword, __v, ...filteredUser } = newUser.toJSON();
      return filteredUser;
    }
  } catch (error) {
    return null;
  }
}

export async function authenticatedUser() {
  await connectDB();
  const session = await getServerAuthSession();

  // console.log("Session:", session);

  if (!session || !session?.user?.id) {
    return null;
  }
  return await User.findOne({ _id: session?.user?.id });
}

export async function authenticatedAdmin() {
  await connectDB();
  const session = await getServerAuthSession();

  // console.log("Session:", session);

  if (!session || !session?.user?.id) {
    return null;
  }

  const user = await User.findOne({ _id: session?.user?.id });
  if (!user) {
    return null;
  }

  return user?.userRole === "admin" ? user : null;
}

export async function authenticatedTrainer() {
  await connectDB();
  const session = await getServerAuthSession();

  // console.log("Session:", session);

  if (!session || !session?.user?.id) {
    return null;
  }

  const user = await User.findOne({ _id: session?.user?.id });
  if (!user) {
    return null;
  }

  return user?.userRole === "trainer" ? user : null;
}

// export function authenticatedUser() {
//   return getServerAuthSession().then(async (session) => {
//     const user = session?.user;

//     if (user) {
//       return await User.findOne({ email: user?.email })
//         .then((result) => {
//           return (
//             (result.userRole === "user" || result.userRole === "admin") &&
//             result
//           );
//         })
//         .catch((error) => {
//           return null;
//         });
//     }

//     return null;
//   });
// }
