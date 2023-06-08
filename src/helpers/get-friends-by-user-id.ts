import { fetchRedis } from "./redis";

export async function getFriendsByUserId(id: string) {
  const friendIds: string[] = await fetchRedis(
    "smembers",
    `user:${id}:friends`
  );

  const friends = await Promise.all(
    friendIds.map(async (fId) => {
      const result: string = await fetchRedis("get", `user:${fId}`);
      const user = JSON.parse(result) as User;
      return user;
    })
  );

  return friends;
}
