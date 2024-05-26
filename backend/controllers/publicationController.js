const uuid = require("uuid");
const path = require("path");
const { Publication } = require("../models/models");
const ApiError = require("../error/ApiError");

class PublicationController {
  async create(req, res, next) {
    try {
      const { title, text } = req.body;
      const { img } = req.files;
      let filename = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", filename));
      const dog = await Publication.create({
        title,
        text,
        img: filename,
      });
      return res.json(dog);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const publications = await Publication.findAll();
      res.json(publications);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    const publication = await Publication.findOne({ where: { id } });
    if (!publication) {
      return next(ApiError.badRequest("Публикация не найдена"));
    }
    res.json(publication);
  }

  async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      const dog = await Publication.findOne({ where: { id } });
      if (!dog) {
        return next(ApiError.badRequest("Публикация не найдена"));
      }
      const deleteResult = await Publication.destroy({ where: { id } });
      if (deleteResult === 0) {
        return next(ApiError.badRequest("Публикация не найдена"));
      }
      res.status(200).json({ message: "Публикация удалена" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async editOne(req, res, next) {
    try {
      const { id } = req.params;
      const { title, text } = req.body;
      const dog = await Publication.update({ title, text }, { where: { id } });
      if (dog[0] === 0) {
        return next(ApiError.badRequest("Собака не найдена"));
      }
      const updatedDog = await Publication.findByPk(id);
      res.json(updatedDog);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}
module.exports = new PublicationController();
