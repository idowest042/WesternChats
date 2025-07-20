import jwt from "jsonwebtoken";  // ✅ Import jsonwebtoken
export const generateToken = (userId, res) => {
    console.log("Signing Token with Secret:", process.env.JWT_SECRET);

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "8d" });

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        domain: '.vercel.app'
    });

    console.log("Generated Token:", token);
    return token;
};
 