const prisma = require('./src/database');

async function createPostsFromMapData() {
  const maps = await prisma.map.findMany(); // 모든 Map 데이터 가져오기

  for (const map of maps) {
    const postTitle = map.title; // Post의 제목을 설정합니다.
    const postInfo = map.address; // Post의 정보를 설정합니다.
    const time = map.install_date;

    await prisma.post.create({
      data: {
        title: postTitle,
        info: postInfo,
        map: { connect: { id: map.id } }, // 현재 Map에 연결된 Post 생성
        createdAt : time
      }
    });
  }

  console.log('Posts created from Map data.');
}

async function main() {
  try {
    await createPostsFromMapData();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

