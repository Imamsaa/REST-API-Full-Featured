import { hash } from "bcryptjs";

const doHash = async (password, saltRounds = 10) => {
    return await hash(password, saltRounds);
};

const verifyHash = async (password, hashedPassword) => {
    return await compare(password, hashedPassword);
}

export default { doHash, verifyHash };