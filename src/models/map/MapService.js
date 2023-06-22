const database = require("../../database");

class MapService {

  async findMapsByKeyword(keyword) {
    const maps = await database.map.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { address: { contains: keyword } },
        ],
      },
    });
    return maps;
  }
  async getAllMapCoordinates() {
    const maps = await database.map.findMany();
    const coordinates = maps.map(map => ({
      latitude: map.lat,
      longitude: map.long,
      title: map.title,
      address: map.address,
    }));
    return coordinates;
  }
}

module.exports = MapService;
