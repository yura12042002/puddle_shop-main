const ApiError = require("../error/ApiError");
const { User } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или пароль"));
    }
    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail) {
      return next(ApiError.badRequest("Данный email уже существует"));
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
      name: "Ivanov",
      surname: "Ivanovich",
      email,
      password: hashPassword,
      role,
    });

    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ message: token });
  }

  async login(req, res, next) {
    const {email, password} = req.body
    const user = await User.findOne({where: {email}})
    if (!user) {
        return next(ApiError.internal("Пользовательн не найден"))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if(!comparePassword) {
        return next(ApiError.internal("указан неверный пароль"))
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ message: token });
  }
 
  async check(req, res, next) {
    try {
      const token = generateJwt(req.user.id, req.user.email, req.user.role);
      return res.json({ token });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }

  }
}
module.exports = new UserController();
