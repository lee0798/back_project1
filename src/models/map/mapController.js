const express = require('express');
const MapService = require('./MapService');

const Router = express.Router();


class MapSearch{
  path = "/maps";
  router;
  mapService;
  constructor(){
    this.router =Router;
    this.mapService = new MapService();
    this.init();
  }
  init(){
    this.router.post('/search', this.findMapsByKeyword.bind(this));
    this.router.get('/', this.getAllMapCoordinates.bind(this));
  }
  async getAllMapCoordinates(req, res, next) {
    try {
      const maps = await this.mapService.getAllMapCoordinates();
      res.status(200).json({ maps });
    } catch (err) {
      next(err);
    }
  }
  async findMapsByKeyword(req, res, next) {
    try {
      const { keyword } = req.body;
      const maps = await this.mapService.findMapsByKeyword(keyword);
      res.status(200).json({ maps });
    } catch (err) {
      next(err);
      }
    }
}
//console.log(router);
const  mapsearch= new MapSearch();
module.exports = mapsearch;
// module.exports = router;
