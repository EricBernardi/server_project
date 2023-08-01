import jsonwebtoken from "jsonwebtoken";

export function tokenValited(
    request,
    response,
    next
){
    const PRIVATE_KEY= '!234sd3ASD!@#sdD2';
    const [, token] = request.headers.authorization?.split(' ') || [' ', ' '];

    if(!token) return response.status(401).send('Usuário ou senha incorretos!');

    try {
        const payload = jsonwebtoken.verify(token, PRIVATE_KEY);
        const userIdFromToken = typeof payload !== 'string' && payload.user;

        if(!user && !userIdFromToken) {
            return response.send(401).json({ message: 'Token inválido!'});
        }

        request.headers['user'] = payload.user;

        return next();
    } catch (error) {
        console.log(error);
        return response.status(401).json({ message: 'Token inválido!'});
    }
}

export default class Auth{}