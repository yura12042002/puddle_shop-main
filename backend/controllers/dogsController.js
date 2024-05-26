const uuid = require("uuid");
const path = require("path");
const { Dogs } = require("../models/models");
const ApiError = require("../error/ApiError");

class DogsController {
  async create(req, res, next) {
    try {
      const { name, age, gender, isAvailable } = req.body;
      const { img } = req.files;
      let filename = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", filename));
      const dog = await Dogs.create({
        name,
        age,
        gender,
        isAvailable,
        img: filename,
      });
      return res.json(dog);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const dogs = await Dogs.findAll();
      res.json(dogs);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    const dog = await Dogs.findOne({ where: { id } });
    if (!dog) {
      return next(ApiError.badRequest("Собачка не найдена"));
    }
    res.json(dog);
  }

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      const dog = await Dogs.findOne({ where: { id } });
      if (!dog) {
        return next(ApiError.badRequest("Собачка не найдена"));
      }
      const deleteResult = await Dogs.destroy({ where: { id } });
      if (deleteResult === 0) {
        return next(ApiError.badRequest("Собачка не найдена"));
      }
      res.status(200).json({ message: "Собака удалена" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async editOne(req, res, next) {
    try {
      const { id } = req.params;
      const { name, age, gender, isAvailable } = req.body;
      const dog = await Dogs.update(
        { name, age, gender, isAvailable },
        { where: { id } }
      );
      if (dog[0] === 0) {
        return next(ApiError.badRequest("Собака не найдена"));
      }
      const updatedDog = await Dogs.findByPk(id);
      res.json(updatedDog);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new DogsController();
