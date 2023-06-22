const prisma = require('./src/database');

async function createChatsData() {
  const posts = await prisma.post.findMany();
  const users = await prisma.user.findMany(); // 모든 Map 데이터 가져오기

  for(const post of posts){
    for(const user of users){
      await prisma.chat.create({
        data: {
          user: { connect: { id: user.id } },
          post: { connect: { id: post.id } }, // 현재 Map에 연결된 Post 생성
        }
      });
    }
  }

  console.log('Chats created from post,user data.');
}

async function main() {
  try {
    await createChatsData();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
